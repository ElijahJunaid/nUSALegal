#!/usr/bin/env node

/**
 * sync-district-court-archive.js
 * Syncs District Court Archives from Trello board rwOFzqqC into
 * server/data/court-procedures.ts using a replace-all strategy.
 *
 * Fetches from multiple lists:
 * - Civil Case Archive
 * - Criminal Case Archive
 * - Administrative Case Archive
 * - Appeal Archive
 * - NELA Archives
 */

import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load .env manually (handles CRLF line endings)
const envPath = path.join(__dirname, '../.env')
if (fs.existsSync(envPath)) {
  for (const rawLine of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eqIdx = line.indexOf('=')
    if (eqIdx === -1) continue
    const key = line.slice(0, eqIdx).trim()
    const value = line
      .slice(eqIdx + 1)
      .trim()
      .replace(/^["']|["']$/g, '')
    if (key && !process.env[key]) process.env[key] = value
  }
}

const BOARD_ID = 'rwOFzqqC'
const TARGET_LISTS = [
  'Civil Case Archive',
  'Criminal Case Archive',
  'Administrative Case Archive',
  'Appeal Archive',
  'NELA Archives'
]
const KEY = process.env.TRELLO_API_KEY
const TOKEN = process.env.TRELLO_TOKEN
const OUTPUT_FILE = path.join(__dirname, '../server/data/court-procedures.ts')

if (!KEY || !TOKEN) {
  console.error('❌ Missing TRELLO_API_KEY or TRELLO_TOKEN in .env')
  process.exit(1)
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, res => {
        let data = ''
        res.on('data', c => {
          data += c
        })
        res.on('end', () => {
          try {
            resolve(JSON.parse(data))
          } catch (e) {
            reject(new Error(`JSON parse error: ${e.message}\nBody: ${data.slice(0, 200)}`))
          }
        })
        res.on('error', reject)
      })
      .on('error', reject)
  })
}

// Parse case information from Trello card
function parseCardName(name) {
  // Try to extract docket number and title
  const docketMatch = name.match(/^([A-Z]{2}-\d{4}-\d{3})\s+(.+)$/i)
  if (docketMatch) {
    return { docketNumber: docketMatch[1], title: docketMatch[2].trim() }
  }

  // Fallback: use full name as title
  return { docketNumber: '', title: name.trim() }
}

// Normalize case type from list name
function normalizeCaseType(listName) {
  const typeMap = {
    'Civil Case Archive': 'civil',
    'Criminal Case Archive': 'criminal',
    'Administrative Case Archive': 'administrative',
    'Appeal Archive': 'appeal',
    'NELA Archives': 'nela'
  }
  return typeMap[listName] || 'other'
}

// Escape string for use inside a TypeScript template literal
function escapeTs(str) {
  return str.replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')
}

async function main() {
  console.log(`🔍 Fetching lists from District Court board (${BOARD_ID})...`)

  const lists = await fetchJson(
    `https://api.trello.com/1/boards/${BOARD_ID}/lists?key=${KEY}&token=${TOKEN}`
  )

  const targetLists = lists.filter(l => TARGET_LISTS.includes(l.name))
  if (targetLists.length === 0) {
    console.error(`❌ No target lists found. Available: ${lists.map(l => l.name).join(', ')}`)
    process.exit(1)
  }

  console.log(
    `📋 Found ${targetLists.length} target lists:\n${targetLists
      .map(l => `  - ${l.name}`)
      .join('\n')}\n`
  )

  const allCases = []

  for (const list of targetLists) {
    console.log(`📄 Fetching cards from "${list.name}"...`)

    const cards = await fetchJson(
      `https://api.trello.com/1/lists/${list.id}/cards?key=${KEY}&token=${TOKEN}`
    )

    console.log(`  Found ${cards.length} cards`)

    for (const card of cards) {
      const { docketNumber, title } = parseCardName(card.name)
      const caseType = normalizeCaseType(list.name)

      // Extract date from card or use creation date
      const caseDate = card.due
        ? new Date(card.due).toISOString().split('T')[0]
        : new Date(card.dateLastActivity).toISOString().split('T')[0]

      // Generate unique ID
      const id = docketNumber
        ? docketNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')
        : `case-${card.id.slice(-8)}`

      allCases.push({
        id,
        title,
        docketNumber: docketNumber || 'Unknown',
        caseType,
        date: caseDate,
        court: 'District Court',
        description: card.desc || '',
        status: 'Archived',
        url: card.url
      })

      console.log(
        `  ✓ ${docketNumber || 'No docket'} - ${title.slice(0, 50)}${title.length > 50 ? '...' : ''}`
      )
    }
  }

  console.log(`\n✅ Total cases parsed: ${allCases.length}`)

  // --- Generate TypeScript file ---
  const casesTs = allCases
    .map(c => {
      return [
        `  {`,
        `    id: '${escapeTs(c.id)}',`,
        `    title: '${escapeTs(c.title)}',`,
        `    docketNumber: '${escapeTs(c.docketNumber)}',`,
        `    caseType: '${c.caseType}',`,
        `    date: '${c.date}',`,
        `    court: '${escapeTs(c.court)}',`,
        `    description: '${escapeTs(c.description)}',`,
        `    status: '${escapeTs(c.status)}',`,
        `    url: '${escapeTs(c.url)}'`,
        `  }`
      ].join('\n')
    })
    .join(',\n')

  const fileContent = `// Auto-generated by sync-district-court-archive.js
// DO NOT EDIT MANUALLY - Run script to update

export const districtCourtArchive = [
${casesTs}
]

export default districtCourtArchive
`

  // Append to existing file
  let existingContent = ''
  if (fs.existsSync(OUTPUT_FILE)) {
    existingContent = fs.readFileSync(OUTPUT_FILE, 'utf8')
  }

  // Remove existing districtCourtArchive if it exists
  if (existingContent.includes('export const districtCourtArchive')) {
    const startIdx = existingContent.indexOf('// Auto-generated by sync-district-court-archive.js')
    const endIdx = existingContent.lastIndexOf('}') + 1
    existingContent =
      existingContent.substring(0, startIdx) + existingContent.substring(endIdx).trim()
  }

  // Append the new content at the end
  fs.writeFileSync(OUTPUT_FILE, existingContent + '\n\n' + fileContent, 'utf8')
  console.log(`\n📁 Generated: ${OUTPUT_FILE}`)
  console.log(`🎉 District Court Archive sync completed successfully!`)
}

main().catch(error => {
  console.error('❌ Error during sync:', error.message)
  process.exit(1)
})
