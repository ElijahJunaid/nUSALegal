import { promises as fs } from 'node:fs'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Interface para adaptadores de storage externo
 */
interface StorageAdapter {
    getPdf(filePath: string): Promise<Buffer | null>
    isAvailable(): boolean
}

/**
 * Adaptador para sistema de arquivos local (desenvolvimento)
 */
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
            // Normalizar o filePath (remover barras duplas, prevenir path traversal)
            const normalizedPath = filePath.replace(/\/+/g, '/').replace(/^\/+/, '')
            
            // Segurança: prevenir path traversal
            if (normalizedPath.includes('..') || normalizedPath.includes('~')) {
                console.error('❌ [PDF Storage] Tentativa de path traversal bloqueada:', filePath)
                return null
            }

            const fullPath = join(this.basePath, normalizedPath)
            
            // Verificar se o caminho está dentro do basePath (segurança adicional)
            if (!fullPath.startsWith(this.basePath)) {
                console.error('❌ [PDF Storage] Caminho fora do diretório base:', filePath)
                return null
            }

            if (!existsSync(fullPath)) {
                return null
            }

            return await fs.readFile(fullPath)
        } catch (error: any) {
            console.error('❌ [PDF Storage] Erro ao ler arquivo do sistema:', error?.message)
            return null
        }
    }
}

/**
 * Adaptador para Netlify Blobs (nativo do Netlify)
 */
class NetlifyBlobsStorageAdapter implements StorageAdapter {
    private storeName: string

    constructor(storeName: string = 'pdfs') {
        this.storeName = storeName
    }

    isAvailable(): boolean {
        // Verificar se estamos no Netlify (o Blobs está sempre disponível no Netlify)
        // Também verificar se estamos em Lambda (Netlify Functions)
        const isNetlify = process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY_DEV
        console.log('🔍 [PDF Storage] NetlifyBlobsStorageAdapter.isAvailable():', isNetlify)
        return !!isNetlify
    }

    async getPdf(filePath: string): Promise<Buffer | null> {
        try {
            // Dynamic import do Netlify Blobs SDK
            let getStore: any
            try {
                const blobsModule = await import('@netlify/blobs')
                getStore = blobsModule.getStore
            } catch (importError: any) {
                console.error('❌ [PDF Storage] @netlify/blobs não está instalado. Instale com: npm install @netlify/blobs')
                return null
            }

            console.log('🔍 [PDF Storage] Criando store do Netlify Blobs...')
            console.log('🔍 [PDF Storage] Store name:', this.storeName)
            console.log('🔍 [PDF Storage] FilePath:', filePath)
            
            const store = getStore({
                name: this.storeName,
                consistency: 'strong' // Para garantir que leituras vejam as últimas escritas
            })

            console.log('✅ [PDF Storage] Store criado, buscando arquivo...')
            const data = await store.get(filePath, { type: 'arrayBuffer' })
            
            console.log('🔍 [PDF Storage] Dados obtidos:', data ? `${data.byteLength} bytes` : 'null')
            
            if (!data) {
                return null
            }

            return Buffer.from(data)
        } catch (error: any) {
            console.error('❌ [PDF Storage] Erro ao buscar PDF do Netlify Blobs:', error?.message)
            return null
        }
    }
}

/**
 * Adaptador para S3 (AWS) - alternativa externa
 */
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
        try {
            // Dynamic import do AWS SDK para não incluir no bundle se não usado
            // Nota: Instale @aws-sdk/client-s3 se for usar S3: npm install @aws-sdk/client-s3
            let S3Client: any, GetObjectCommand: any
            try {
                const s3Module = await import('@aws-sdk/client-s3')
                S3Client = s3Module.S3Client
                GetObjectCommand = s3Module.GetObjectCommand
            } catch (importError: any) {
                console.error('❌ [PDF Storage] @aws-sdk/client-s3 não está instalado. Instale com: npm install @aws-sdk/client-s3')
                return null
            }
            
            const s3Client = new S3Client({
                region: this.region,
                credentials: this.accessKeyId && this.secretAccessKey ? {
                    accessKeyId: this.accessKeyId,
                    secretAccessKey: this.secretAccessKey,
                } : undefined, // Usar credenciais IAM se não fornecidas
            })

            const command = new GetObjectCommand({
                Bucket: this.bucket,
                Key: `bills/${filePath}`,
            })

            const response = await s3Client.send(command)
            
            if (!response.Body) {
                return null
            }

            // Converter stream para buffer
            const chunks: Uint8Array[] = []
            const stream = response.Body as any
            
            for await (const chunk of stream) {
                chunks.push(chunk)
            }

            return Buffer.concat(chunks)
        } catch (error: any) {
            console.error('❌ [PDF Storage] Erro ao buscar PDF do S3:', error?.message)
            return null
        }
    }
}

/**
 * Factory para criar o adaptador de storage apropriado
 */
function createStorageAdapter(): StorageAdapter {
    // Debug: verificar variáveis de ambiente
    console.log('🔍 [PDF Storage] Verificando ambiente...')
    console.log('🔍 [PDF Storage] NETLIFY:', process.env.NETLIFY)
    console.log('🔍 [PDF Storage] NODE_ENV:', process.env.NODE_ENV)
    console.log('🔍 [PDF Storage] AWS_LAMBDA_FUNCTION_NAME:', process.env.AWS_LAMBDA_FUNCTION_NAME)
    
    // Prioridade 1: Netlify Blobs (nativo do Netlify)
    // O Netlify define automaticamente NETLIFY=true no ambiente de produção
    // Também verificar se estamos em um ambiente Lambda (Netlify Functions)
    const isNetlify = process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY_DEV
    
    if (isNetlify) {
        const netlifyBlobsStore = process.env.NETLIFY_BLOBS_STORE_NAME || 'pdfs'
        console.log('📦 [PDF Storage] Usando Netlify Blobs storage:', netlifyBlobsStore)
        return new NetlifyBlobsStorageAdapter(netlifyBlobsStore)
    }

    // Prioridade 2: S3 (se configurado)
    const s3Bucket = process.env.PDF_STORAGE_S3_BUCKET
    const s3Region = process.env.PDF_STORAGE_S3_REGION || 'us-east-1'
    
    if (s3Bucket && s3Region) {
        console.log('📦 [PDF Storage] Usando S3 storage:', s3Bucket)
        return new S3StorageAdapter({
            bucket: s3Bucket,
            region: s3Region,
            accessKeyId: process.env.PDF_STORAGE_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.PDF_STORAGE_S3_SECRET_ACCESS_KEY,
        })
    }

    // Fallback: sistema de arquivos local (apenas desenvolvimento)
    console.log('📁 [PDF Storage] Usando sistema de arquivos local (desenvolvimento)')
    return new FileSystemStorageAdapter()
}

// Cache do adaptador para reutilização
let storageAdapter: StorageAdapter | null = null

/**
 * Obtém o adaptador de storage (com cache)
 */
function getStorageAdapter(): StorageAdapter {
    if (!storageAdapter) {
        storageAdapter = createStorageAdapter()
    }
    return storageAdapter
}

/**
 * Busca um PDF do storage configurado
 */
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

