import { promises as fs } from 'node:fs'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { dLog, dError } from './debug'

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
        dError('❌ [PDF Storage] Path traversal attempt blocked:', filePath)
        return null
      }

      const fullPath = join(this.basePath, normalizedPath)

      if (!fullPath.startsWith(this.basePath)) {
        dError('❌ [PDF Storage] Path outside the base directory:', filePath)
        return null
      }

      if (!existsSync(fullPath)) {
        return null
      }

      return await fs.readFile(fullPath)
    } catch (error: unknown) {
      dError(
        '❌ [PDF Storage] Error reading system file:',
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
    dLog('🔍 [PDF Storage] NetlifyBlobsStorageAdapter.isAvailable():', isNetlify)
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
        dError(
          '❌ [PDF Storage] @netlify/blobs is not installed. Install with: npm install @netlify/blobs'
        )
        return null
      }

      dLog('🔍 [PDF Storage] Creating Netlify Blobs store...')
      dLog('🔍 [PDF Storage] Store name:', this.storeName)
      dLog('🔍 [PDF Storage] FilePath:', filePath)

      const store = blobsModule.getStore({
        name: this.storeName,
        consistency: 'strong'
      })

      dLog('✅ [PDF Storage] Store created, fetching file...')
      const data = await store.get(filePath, { type: 'arrayBuffer' })

      dLog('🔍 [PDF Storage] Obtained data:', data ? `${data.byteLength} bytes` : 'null')

      if (!data) {
        return null
      }

      return Buffer.from(data)
    } catch (error: unknown) {
      dError(
        '❌ [PDF Storage] Error fetching PDF from Netlify Blobs:',
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
        dError(
          '❌ [PDF Storage] @aws-sdk/client-s3 is not installed. Install with: npm install @aws-sdk/client-s3'
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
      dError(
        '❌ [PDF Storage] Error fetching PDF from S3:',
        error instanceof Error ? error.message : String(error)
      )
      return null
    }
  }
}

function createStorageAdapter(): StorageAdapter {
  dLog('🔍 [PDF Storage] Checking environment...')
  dLog('🔍 [PDF Storage] NETLIFY:', process.env.NETLIFY)
  dLog('🔍 [PDF Storage] NODE_ENV:', process.env.NODE_ENV)
  dLog('🔍 [PDF Storage] AWS_LAMBDA_FUNCTION_NAME:', process.env.AWS_LAMBDA_FUNCTION_NAME)

  const isNetlify =
    process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY_DEV

  if (isNetlify) {
    const netlifyBlobsStore = process.env.NETLIFY_BLOBS_STORE_NAME || 'pdfs'
    dLog('📦 [PDF Storage] Using Netlify Blobs storage:', netlifyBlobsStore)
    return new NetlifyBlobsStorageAdapter(netlifyBlobsStore)
  }

  const s3Bucket = process.env.PDF_STORAGE_S3_BUCKET
  const s3Region = process.env.PDF_STORAGE_S3_REGION || 'us-east-1'

  if (s3Bucket && s3Region) {
    dLog('📦 [PDF Storage] Using S3 storage:', s3Bucket)
    return new S3StorageAdapter({
      bucket: s3Bucket,
      region: s3Region,
      accessKeyId: process.env.PDF_STORAGE_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.PDF_STORAGE_S3_SECRET_ACCESS_KEY
    })
  }

  dLog('📁 [PDF Storage] Using local file system (development)')
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
  dLog('🔍 [PDF Storage] getPdfFromStorage called with filePath:', filePath)
  const adapter = getStorageAdapter()

  dLog('🔍 [PDF Storage] Adapter created:', adapter.constructor.name)
  dLog('🔍 [PDF Storage] Adapter available?', adapter.isAvailable())

  if (!adapter.isAvailable()) {
    dError('❌ [PDF Storage] Storage adapter not available')
    dError('❌ [PDF Storage] Adapter type:', adapter.constructor.name)
    return null
  }

  dLog('✅ [PDF Storage] Adapter available, fetching PDF...')
  const result = await adapter.getPdf(filePath)
  dLog('🔍 [PDF Storage] Result:', result ? `${result.length} bytes` : 'null')
  return result
}
