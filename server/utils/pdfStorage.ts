import { promises as fs } from 'node:fs'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

interface StorageAdapter {
  getPdf(filePath: string): Promise<Buffer | null>
  isAvailable(): boolean
}

class FileSystemStorageAdapter implements StorageAdapter {
  private basePath: string

  constructor(basePath: string = join(process.cwd(), 'server', 'bills')) {
    this.basePath = basePath
  }

  isAvailable(): boolean {
    return existsSync(this.basePath)
  }

  async getPdf(filePath: string): Promise<Buffer | null> {
    try {
      const normalizedPath = filePath.replace(/\/+/g, '/').replace(/^\/+/, '')

      if (normalizedPath.includes('..') || normalizedPath.includes('~')) {
        console.error('❌ [PDF Storage] Tentativa de path traversal bloqueada:', filePath)
        return null
      }

      const fullPath = join(this.basePath, normalizedPath)

      if (!fullPath.startsWith(this.basePath)) {
        console.error('❌ [PDF Storage] Caminho fora do diretório base:', filePath)
        return null
      }

      if (!existsSync(fullPath)) {
        return null
      }

      return await fs.readFile(fullPath)
    } catch (error: unknown) {
      console.error(
        '❌ [PDF Storage] Erro ao ler arquivo do sistema:',
        error instanceof Error ? error.message : String(error)
      )
      return null
    }
  }
}

class NetlifyBlobsStorageAdapter implements StorageAdapter {
  private storeName: string

  constructor(storeName: string = 'pdfs') {
    this.storeName = storeName
  }

  isAvailable(): boolean {
    const isNetlify =
      process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY_DEV
    console.log('🔍 [PDF Storage] NetlifyBlobsStorageAdapter.isAvailable():', isNetlify)
    return !!isNetlify
  }

  async getPdf(filePath: string): Promise<Buffer | null> {
    type BlobStore = {
      get: (key: string, options: { type: string }) => Promise<ArrayBuffer | null>
    }
    type BlobsModule = { getStore: (options: { name: string; consistency: string }) => BlobStore }
    try {
      let blobsModule: BlobsModule
      try {
        blobsModule = (await import('@netlify/blobs')) as unknown as BlobsModule
      } catch {
        console.error(
          '❌ [PDF Storage] @netlify/blobs não está instalado. Instale com: npm install @netlify/blobs'
        )
        return null
      }

      console.log('🔍 [PDF Storage] Criando store do Netlify Blobs...')
      console.log('🔍 [PDF Storage] Store name:', this.storeName)
      console.log('🔍 [PDF Storage] FilePath:', filePath)

      const store = blobsModule.getStore({
        name: this.storeName,
        consistency: 'strong'
      })

      console.log('✅ [PDF Storage] Store criado, buscando arquivo...')
      const data = await store.get(filePath, { type: 'arrayBuffer' })

      console.log('🔍 [PDF Storage] Dados obtidos:', data ? `${data.byteLength} bytes` : 'null')

      if (!data) {
        return null
      }

      return Buffer.from(data)
    } catch (error: unknown) {
      console.error(
        '❌ [PDF Storage] Erro ao buscar PDF do Netlify Blobs:',
        error instanceof Error ? error.message : String(error)
      )
      return null
    }
  }
}

class S3StorageAdapter implements StorageAdapter {
  private bucket: string
  private region: string
  private accessKeyId?: string
  private secretAccessKey?: string

  constructor(config: {
    bucket: string
    region: string
    accessKeyId?: string
    secretAccessKey?: string
  }) {
    this.bucket = config.bucket
    this.region = config.region
    this.accessKeyId = config.accessKeyId
    this.secretAccessKey = config.secretAccessKey
  }

  isAvailable(): boolean {
    return !!this.bucket && !!this.region
  }

  async getPdf(filePath: string): Promise<Buffer | null> {
    type S3SendResult = { Body?: AsyncIterable<Uint8Array> }
    type S3Module = {
      S3Client: new (config: {
        region: string
        credentials?: { accessKeyId: string; secretAccessKey: string }
      }) => { send: (command: unknown) => Promise<S3SendResult> }
      GetObjectCommand: new (input: { Bucket: string; Key: string }) => unknown
    }
    try {
      let s3Module: S3Module
      try {
        s3Module = (await import('@aws-sdk/client-s3')) as unknown as S3Module
      } catch {
        console.error(
          '❌ [PDF Storage] @aws-sdk/client-s3 não está instalado. Instale com: npm install @aws-sdk/client-s3'
        )
        return null
      }

      const { S3Client, GetObjectCommand } = s3Module

      const s3Client = new S3Client({
        region: this.region,
        credentials:
          this.accessKeyId && this.secretAccessKey
            ? {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey
              }
            : undefined
      })

      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: `bills/${filePath}`
      })

      const response = await s3Client.send(command)

      if (!response.Body) {
        return null
      }

      const chunks: Uint8Array[] = []

      for await (const chunk of response.Body) {
        chunks.push(chunk)
      }

      return Buffer.concat(chunks)
    } catch (error: unknown) {
      console.error(
        '❌ [PDF Storage] Erro ao buscar PDF do S3:',
        error instanceof Error ? error.message : String(error)
      )
      return null
    }
  }
}

function createStorageAdapter(): StorageAdapter {
  console.log('🔍 [PDF Storage] Verificando ambiente...')
  console.log('🔍 [PDF Storage] NETLIFY:', process.env.NETLIFY)
  console.log('🔍 [PDF Storage] NODE_ENV:', process.env.NODE_ENV)
  console.log('🔍 [PDF Storage] AWS_LAMBDA_FUNCTION_NAME:', process.env.AWS_LAMBDA_FUNCTION_NAME)

  const isNetlify =
    process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY_DEV

  if (isNetlify) {
    const netlifyBlobsStore = process.env.NETLIFY_BLOBS_STORE_NAME || 'pdfs'
    console.log('📦 [PDF Storage] Usando Netlify Blobs storage:', netlifyBlobsStore)
    return new NetlifyBlobsStorageAdapter(netlifyBlobsStore)
  }

  const s3Bucket = process.env.PDF_STORAGE_S3_BUCKET
  const s3Region = process.env.PDF_STORAGE_S3_REGION || 'us-east-1'

  if (s3Bucket && s3Region) {
    console.log('📦 [PDF Storage] Usando S3 storage:', s3Bucket)
    return new S3StorageAdapter({
      bucket: s3Bucket,
      region: s3Region,
      accessKeyId: process.env.PDF_STORAGE_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.PDF_STORAGE_S3_SECRET_ACCESS_KEY
    })
  }

  console.log('📁 [PDF Storage] Usando sistema de arquivos local (desenvolvimento)')
  return new FileSystemStorageAdapter()
}

let storageAdapter: StorageAdapter | null = null

function getStorageAdapter(): StorageAdapter {
  if (!storageAdapter) {
    storageAdapter = createStorageAdapter()
  }
  return storageAdapter
}

export async function getPdfFromStorage(filePath: string): Promise<Buffer | null> {
  console.log('🔍 [PDF Storage] getPdfFromStorage chamado com filePath:', filePath)
  const adapter = getStorageAdapter()

  console.log('🔍 [PDF Storage] Adaptador criado:', adapter.constructor.name)
  console.log('🔍 [PDF Storage] Adaptador disponível?', adapter.isAvailable())

  if (!adapter.isAvailable()) {
    console.error('❌ [PDF Storage] Adaptador de storage não disponível')
    console.error('❌ [PDF Storage] Tipo do adaptador:', adapter.constructor.name)
    return null
  }

  console.log('✅ [PDF Storage] Adaptador disponível, buscando PDF...')
  const result = await adapter.getPdf(filePath)
  console.log('🔍 [PDF Storage] Resultado:', result ? `${result.length} bytes` : 'null')
  return result
}
