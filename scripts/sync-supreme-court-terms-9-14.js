#!/usr/bin/env node

/**
 * sync-supreme-court-terms-9-14.js
 * Syncs Supreme Court Terms 9-14 from Trello board 7wrUfobv into
 * server/data/supreme-court-rulings.ts.
 *
 * Fetches from lists:
 * - Term 9 Archives
 * - Term 10 Archives
 * - Term 11 Archives
 * - Term 12 Archives
 * - Term 13 Archives
 * - Term 14 Archives
 *
 * Extracts PDF/Google Doc links from card descriptions in <Date> | <text> format
 * Filters ruling links from other content
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

const BOARD_ID = '7wrUfobv'
const TARGET_LISTS = [
  'Term 9 Archives',
  'Term 10 Archives',
  'Term 11 Archives',
  'Term 12 Archives',
  'Term 13 Archives',
  'Term 14 Archives'
]
const KEY = process.env.TRELLO_API_KEY
const TOKEN = process.env.TRELLO_TOKEN
const OUTPUT_FILE = path.join(__dirname, '../server/data/supreme-court-rulings-terms-9-14.ts')

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

// Parse ruling information from Trello card
function parseCardName(name) {
  // Try to extract docket number and title
  const docketMatch = name.match(/^(\d{4}-SC-\d+)\s+(.+)$/i)
  if (docketMatch) {
    return { docketNumber: docketMatch[1], title: docketMatch[2].trim() }
  }

  // Try v. format
  const versusMatch = name.match(/^(.+?)\s+v\.\s+(.+)$/i)
  if (versusMatch) {
    return { docketNumber: '', title: name.trim() }
  }

  // Fallback: use full name as title
  return { docketNumber: '', title: name.trim() }
}

// Extract term number from list name
function extractTermNumber(listName) {
  const match = listName.match(/Term (\d+)/)
  return match ? parseInt(match[1]) : 0
}

// Extract links from card description in <Date> | <text> format
function extractLinks(description) {
  if (!description) return []

  const lines = description.split('\n')
  const links = []

  for (const line of lines) {
    const match = line.match(/^\s*<([^|>]+)>\s*\|\s*([^|]+)$/i)
    if (match) {
      const [, date, text] = match
      const urlMatch = text.match(/https?:\/\/[^\s]+/i)
      if (urlMatch) {
        links.push({
          date: date.trim(),
          text: text.trim(),
          url: urlMatch[0]
        })
      }
    }
  }

  return links
}

// Filter ruling links from other content
function filterRulingLinks(links, cardTitle) {
  // Keywords that suggest ruling content
  const rulingKeywords = [
    'ruling',
    'opinion',
    'decision',
    'judgment',
    'order',
    'scotus',
    'supreme court',
    'court',
    'pdf',
    'document'
  ]

  return links.filter(link => {
    const textLower = link.text.toLowerCase()
    const titleLower = cardTitle.toLowerCase()

    return rulingKeywords.some(
      keyword => textLower.includes(keyword) || titleLower.includes(keyword)
    )
  })
}

// Escape string for use inside a TypeScript template literal
function escapeTs(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')
}

async function main() {
  console.log(`🔍 Fetching lists from Supreme Court board (${BOARD_ID})...`)

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

  const allRulings = []

  for (const list of targetLists) {
    const termNumber = extractTermNumber(list.name)
    console.log(`📄 Fetching cards from "${list.name}" (Term ${termNumber})...`)

    const cards = await fetchJson(
      `https://api.trello.com/1/lists/${list.id}/cards?key=${KEY}&token=${TOKEN}`
    )

    console.log(`  Found ${cards.length} cards`)

    for (const card of cards) {
      const { docketNumber, title } = parseCardName(card.name)

      // Extract links from description
      const allLinks = extractLinks(card.desc)
      const rulingLinks = filterRulingLinks(allLinks, title)

      // Extract date from card or use creation date
      const rulingDate = card.due
        ? new Date(card.due).toISOString().split('T')[0]
        : new Date(card.dateLastActivity).toISOString().split('T')[0]

      // Generate unique ID
      const id = docketNumber
        ? docketNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')
        : `ruling-${card.id.slice(-8)}`

      allRulings.push({
        id,
        title,
        docketNumber: docketNumber || `Term ${termNumber}-${card.id.slice(-6)}`,
        term: termNumber,
        date: rulingDate,
        court: 'Supreme Court',
        description: card.desc || '',
        status: 'Archived',
        url: card.url,
        links: rulingLinks,
        linkCount: rulingLinks.length
      })

      console.log(
        `  ✓ ${docketNumber || `T${termNumber}`} - ${title.slice(0, 40)}${title.length > 40 ? '...' : ''} (${rulingLinks.length} links)`
      )
    }
  }

  console.log(`\n✅ Total rulings parsed: ${allRulings.length}`)

  // --- Generate TypeScript file ---
  const rulingsTs = allRulings
    .map(r => {
      const linksTs = r.links
        .map(
          l =>
            `        { date: '${escapeTs(l.date)}', text: '${escapeTs(l.text)}', url: '${escapeTs(l.url)}' }`
        )
        .join(',\n')

      return [
        `  {`,
        `    id: '${escapeTs(r.id)}',`,
        `    title: '${escapeTs(r.title)}',`,
        `    docketNumber: '${escapeTs(r.docketNumber)}',`,
        `    term: ${r.term},`,
        `    date: '${r.date}',`,
        `    court: '${escapeTs(r.court)}',`,
        `    description: '${escapeTs(r.description)}',`,
        `    status: '${escapeTs(r.status)}',`,
        `    url: '${escapeTs(r.url)}',`,
        `    links: [`,
        linksTs,
        `    ],`,
        `    linkCount: ${r.linkCount}`,
        `  }`
      ].join('\n')
    })
    .join(',\n')

  const fileContent = `// Auto-generated by sync-supreme-court-terms-9-14.js
// DO NOT EDIT MANUALLY - Run script to update

export const supremeCourtRulingsTerms9To14 = [
${rulingsTs}
]

export default supremeCourtRulingsTerms9To14
`

  fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf8')
  console.log(`\n📁 Generated: ${OUTPUT_FILE}`)
  console.log(`🎉 Supreme Court Terms 9-14 sync completed successfully!`)
}

main().catch(error => {
  console.error('❌ Error during sync:', error.message)
  process.exit(1)
})
