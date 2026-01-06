

import axios from 'axios'

interface TrelloCard {
  name: string
  desc: string
  url: string
}

interface TrelloMatch {
  board: string
  card: string
  list: string
  url: string
  description: string
}

interface TrelloCheckResults {
  hasSevereBans: boolean
  hasMinorBans: boolean
  hasBlacklists: boolean
  hasWarrants: boolean
  severeBans: TrelloMatch[]
  minorBans: TrelloMatch[]
  blacklists: TrelloMatch[]
  warrants: TrelloMatch[]
}

const trelloBoards = {
  severeBans: ['1sH1ZM3A', '1OQj0CTk'],
  minorBans: ['BtAXade2', '2w4zaqFS'],
  departmentBlacklists: [] as string[],
  warrantDatabase: ['exfhKJtm']
}

const boardListNames: Record<string, string> = {
  'BtAXade2': 'Blacklisted',
  '2w4zaqFS': 'Bank Bans',
  'exfhKJtm': 'AoS Players',
  '1sH1ZM3A': 'Capitol Banned',
  '1OQj0CTk': 'Prison Bans'
}

function getTrelloConfig() {
  const key = process.env.TRELLO_API_KEY
  const token = process.env.TRELLO_TOKEN
  return { key, token }
}

async function getBoardName(boardId: string, key: string, token: string): Promise<string> {
  const url = `https://api.trello.com/1/boards/${boardId}?key=${key}&token=${token}`
  const response = await axios.get(url)
  return response.data.name
}

async function getBoardLists(boardId: string, key: string, token: string) {
  const url = `https://api.trello.com/1/boards/${boardId}/lists?key=${key}&token=${token}`
  const response = await axios.get(url)
  return response.data
}

async function getBoardCards(boardId: string, key: string, token: string): Promise<TrelloCard[]> {
  const lists = await getBoardLists(boardId, key, token)
  const targetListName = boardListNames[boardId]
  const targetList = lists.find((list: any) => list.name === targetListName)

  if (!targetList) {
    return []
  }

  const url = `https://api.trello.com/1/lists/${targetList.id}/cards?key=${key}&token=${token}`
  const response = await axios.get(url)
  return response.data
}

async function checkBoardCategory(
  username: string,
  boards: string[],
  key: string,
  token: string
): Promise<TrelloMatch[]> {
  const results: TrelloMatch[] = []

  for (const boardId of boards) {
    try {
      const boardName = await getBoardName(boardId, key, token)
      const cards = await getBoardCards(boardId, key, token)

      const matches = cards.filter(card => {
        const cardUsername = card.name?.split(':')[0]
        return cardUsername?.toLowerCase() === username.toLowerCase()
      })

      const listName = boardListNames[boardId] || 'Unknown List'
      results.push(...matches.map(card => ({
        board: boardId,
        card: card.name,
        list: listName,
        url: card.url,
        description: card.desc
      })))
    } catch (error: any) {
      console.error(`Error accessing board ${boardId}:`, error.response?.statusText || error.message)
    }
  }

  return results
}

export async function checkTrelloBoards(username: string): Promise<TrelloCheckResults> {
  const { key, token } = getTrelloConfig()

  if (!key || !token) {
    console.error('Missing Trello credentials')
    return {
      hasSevereBans: false,
      hasMinorBans: false,
      hasBlacklists: false,
      hasWarrants: false,
      severeBans: [],
      minorBans: [],
      blacklists: [],
      warrants: []
    }
  }

  const [severeBans, minorBans, blacklists, warrants] = await Promise.all([
    checkBoardCategory(username, trelloBoards.severeBans, key, token),
    checkBoardCategory(username, trelloBoards.minorBans, key, token),
    checkBoardCategory(username, trelloBoards.departmentBlacklists, key, token),
    checkBoardCategory(username, trelloBoards.warrantDatabase, key, token)
  ])

  return {
    hasSevereBans: severeBans.length > 0,
    hasMinorBans: minorBans.length > 0,
    hasBlacklists: blacklists.length > 0,
    hasWarrants: warrants.length > 0,
    severeBans,
    minorBans,
    blacklists,
    warrants
  }
}

export { trelloBoards }
