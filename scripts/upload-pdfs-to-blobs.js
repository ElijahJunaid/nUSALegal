import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { getStore } from '@netlify/blobs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDFS_DIR = path.join(process.cwd(), 'server', 'bills');
const STORE_NAME = process.env.NETLIFY_BLOBS_STORE_NAME || 'pdfs';

console.log('📦 [UPLOAD PDFs] Starting upload to Netlify Blobs...');
console.log('📂 [UPLOAD PDFs] Directory:', PDFS_DIR);
console.log('📦 [UPLOAD PDFs] Store:', STORE_NAME);

if (!fs.existsSync(PDFS_DIR)) {
    console.error(`❌ [UPLOAD PDFs] Directory does not exist: ${PDFS_DIR}`);
    process.exit(1);
}

const accessToken = process.env.NETLIFY_ACCESS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
if (!accessToken) {
    console.error('❌ [UPLOAD PDFs] NETLIFY_ACCESS_TOKEN not configured');
    console.error('   Set with: set NETLIFY_ACCESS_TOKEN=your-token (Windows)');
    console.error('   Or: export NETLIFY_ACCESS_TOKEN=your-token (Linux/Mac)');
    console.error('   Or log in: netlify login');
    process.exit(1);
}

function findPDFs(dir, baseDir = dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
        
        if (entry.isDirectory()) {
            findPDFs(fullPath, baseDir, files);
        } else if (entry.name.endsWith('.pdf')) {
            files.push({
                fullPath,
                relativePath: relativePath.startsWith('bills/') ? relativePath : `bills/${relativePath}`
            });
        }
    }
    
    return files;
}

function getSiteID() {
    let siteID = process.env.NETLIFY_SITE_ID;

    if (!siteID) {
        console.log('🔍 [UPLOAD PDFs] Trying to get Netlify siteID...');
        try {
            const statusOutput = execSync('netlify status --json', { encoding: 'utf-8', stdio: 'pipe' });
            const status = JSON.parse(statusOutput);
            if (status.siteId) {
                siteID = status.siteId;
                console.log(`✅ [UPLOAD PDFs] SiteID obtained: ${siteID}`);
            }
        } catch (e) {
            console.log('⚠️ [UPLOAD PDFs] Could not obtain siteID from Netlify status');
        }
    }

    if (!siteID) {
        console.error('❌ [UPLOAD PDFs] NETLIFY_SITE_ID is not set');
        console.error('   You can get the siteID in two ways:');
        console.error('   1. No dashboard do Netlify: Site settings > General > Site details > Site ID');
        console.error('   2. Or set up: set NETLIFY_SITE_ID=your-site-id');
        console.error('');
        console.error('   Example: set NETLIFY_SITE_ID=abc123-def456-ghi789');
        process.exit(1);
    }

    return siteID;
}

async function uploadPDFs() {
    const siteID = getSiteID();
    try {
        const storeConfig = {
            name: STORE_NAME,
            consistency: 'strong'
        };

        if (!process.env.NETLIFY) {
            storeConfig.siteID = siteID;
            storeConfig.token = accessToken;
            console.log('📦 [UPLOAD PDFs] Using explicit credentials (local environment)');
        }

        const store = getStore(storeConfig);

        console.log('🔍 [UPLOAD PDFs] Looking for PDFs...');
        const pdfFiles = findPDFs(PDFS_DIR);
        
        if (pdfFiles.length === 0) {
            console.log('⚠️ [UPLOAD PDFs] No PDF found');
            return;
        }

        console.log(`📄 [UPLOAD PDFs] PDF ${pdfFiles.length} files found`);

        let successCount = 0;
        let errorCount = 0;

        for (const file of pdfFiles) {
            try {
                console.log(`📤 [UPLOAD PDFs] Sending: ${file.relativePath}...`);
                
                const fileBuffer = fs.readFileSync(file.fullPath);
                
                await store.set(file.relativePath, fileBuffer, {
                    contentType: 'application/pdf'
                });
                
                console.log(`✅ [UPLOAD PDFs] Sending: ${file.relativePath} (${(fileBuffer.length / 1024).toFixed(2)} KB)`);
                successCount++;
            } catch (error) {
                console.error(`❌ [UPLOAD PDFs] Error sending ${file.relativePath}:`, error.message);
                errorCount++;
            }
        }

        console.log('\n📊 [UPLOAD PDFs] Summary:');
        console.log(`   ✅ Success: ${successCount}`);
        console.log(`   ❌ Errors: ${errorCount}`);
        console.log(`   📄 Total: ${pdfFiles.length}`);

        if (errorCount > 0) {
            process.exit(1);
        }

        console.log('\n✅ [UPLOAD PDFs] Upload completed successfully!');
    } catch (error) {
        console.error('❌ [UPLOAD PDFs] Fatal error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

uploadPDFs();