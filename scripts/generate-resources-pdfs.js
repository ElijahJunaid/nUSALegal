#!/usr/bin/env node

/**
 * generate-resources-pdfs.js
 * Generates the 42 editable PDF files listed in server/data/files.ts
 * Creates placeholder PDF files that can be edited and downloaded.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Import the files metadata
const filesPath = path.join(__dirname, '../server/data/files.ts')
const filesContent = fs.readFileSync(filesPath, 'utf8')

// Extract file information from the TypeScript file
const files = []

// Parse the files array (simple regex approach for this script)
const fileMatches = filesContent.match(
  /\{\s*title:\s*'([^']+)',\s*fileUrl:\s*'([^']+)',\s*fileType:\s*'([^']+)',\s*category:\s*'([^']+)'\s*\}/g
)

if (fileMatches) {
  for (const match of fileMatches) {
    const titleMatch = match.match(/title:\s*'([^']+)'/)
    const urlMatch = match.match(/fileUrl:\s*'([^']+)'/)
    const typeMatch = match.match(/fileType:\s*'([^']+)'/)
    const categoryMatch = match.match(/category:\s*'([^']+)'/)

    if (titleMatch && urlMatch && typeMatch && categoryMatch) {
      files.push({
        title: titleMatch[1],
        fileUrl: urlMatch[1],
        fileType: typeMatch[1],
        category: categoryMatch[1]
      })
    }
  }
}

console.log(`📄 Found ${files.length} files to generate`)

// Create a simple PDF content (placeholder)
function createPdfContent(title, _category) {
  const content = `%PDF-1.4
1 0 obj
<<
/Title (${title})
/Creator (nUSA Legal Resources Generator)
/Producer (nUSA Legal Platform)
>>
endobj

2 0 obj
<<
/Type /Catalog
/Pages 3 0 R
>>
endobj

3 0 obj
<<
/Type /Pages
/Kids [4 0 R]
/Count 1
>>
endobj

4 0 obj
<<
/Type /Page
/Parent 3 0 R
/MediaBox [0 0 612 792]
/Contents 5 0 R
/Resources <<
/Font <<
/F1 6 0 R
>>
>>
>>
endobj

5 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(${title}) Tj
ET
endstream
endobj

6 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000174 00000 n 
0000000301 00000 n 
0000000380 00000 n 
trailer
<<
/Size 7
/Root 2 0 R
>>
startxref
456
%%EOF`

  return content
}

// Generate files
let createdCount = 0
let skippedCount = 0

for (const file of files) {
  const filePath = path.join(__dirname, '../public', file.fileUrl)
  const dirPath = path.dirname(filePath)

  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }

  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`⚠️  File already exists: ${file.fileUrl}`)
    skippedCount++
    continue
  }

  // Create the PDF file
  const pdfContent = createPdfContent(file.title, file.category)
  fs.writeFileSync(filePath, pdfContent, 'utf8')

  console.log(`✅ Created: ${file.fileUrl}`)
  createdCount++
}

console.log(`\n📊 Summary:`)
console.log(`   ✅ Created: ${createdCount} files`)
console.log(`   ⚠️  Skipped: ${skippedCount} files (already exist)`)
console.log(`   📁 Total: ${files.length} files`)

if (createdCount > 0) {
  console.log(`\n🎉 Resources PDF generation completed successfully!`)
} else {
  console.log(`\nℹ️  All files already exist. No new files created.`)
}
