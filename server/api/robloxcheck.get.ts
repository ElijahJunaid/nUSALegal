

import noblox from 'noblox.js'
import { checkTrelloBoards } from '../utils/trelloConfig'
import { checkGroupBans } from '../utils/groupConfig'

async function getFriendCount(userId: number): Promise<number | null> {
  try {
    const url = `https://friends.roblox.com/v1/users/${userId}/friends/count`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch friend count')
    }
    const data = await response.json()
    return data.count
  } catch (error) {
    console.error('Friend count error:', error)
    return null
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const username = query.username as string

  if (!username) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Username is required'
    })
  }

  if (typeof username !== 'string' || username.length < 3 || !/^[a-zA-Z0-9_ ]+$/.test(username)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid username format'
    })
  }

  try {
    
    const userId = await noblox.getIdFromUsername(username).catch(() => {
      throw new Error('User not found')
    })

    const [userInfo, friendsCount, badges, groups] = await Promise.all([
      noblox.getPlayerInfo(userId),
      getFriendCount(userId),
      noblox.getPlayerBadges(userId, 100).catch(() => []),
      noblox.getGroups(userId)
    ])

    let groupBanResults: Awaited<ReturnType<typeof checkGroupBans>>
    
    try {
      groupBanResults = await checkGroupBans(groups)
    } catch (err) {
      console.error('Group ban check error:', err)
      groupBanResults = {
        severeBanGroups: [],
        minorBanGroups: [],
        hasSevereBans: false,
        hasMinorBans: false,
        tooManyGroups: false,
        hasLimitedRanks: false,
        limitedGroups: [],
        limitedGroupCount: 0,
        limitedRankGroups: []
      }
    }

    const nusaGroup = groups.find((g: any) => g.Id === 758071) || null
    const nusaRank = nusaGroup ? await noblox.getRankInGroup(758071, userId).catch(() => null) : null
    const isFederalPrisoner = nusaGroup?.Role === 'Federal Prisoner'

    const trelloResults = await checkTrelloBoards(userInfo.username).catch(error => {
      console.error('Trello check error:', error)
      return {
        hasSevereBans: false,
        hasMinorBans: false,
        hasBans: false,
        hasBlacklists: false,
        hasWarrants: false,
        severeBans: [],
        minorBans: [],
        bans: [],
        blacklists: [],
        warrants: []
      }
    })

    return {
      id: userId,
      name: userInfo.username,
      display_name: userInfo.displayName,
      created: userInfo.joinDate,
      description: userInfo.blurb,
      is_banned: userInfo.isBanned,
      friends_count: friendsCount,
      badges_count: badges.length,
      groups: groups.map((g: any) => ({
        group_name: g.Name,
        role_name: g.Role
      })),
      nusa_info: nusaGroup ? {
        rank: nusaRank,
        role: nusaGroup.Role
      } : null,
      federal_prisoner: isFederalPrisoner,
      trello_checks: {
        property_bans: [...(trelloResults.severeBans || []), ...(trelloResults.minorBans || [])],
        department_blacklists: trelloResults.blacklists || [],
        warrants: trelloResults.warrants || [],
        has_bans: (trelloResults.severeBans?.length || 0) > 0 || (trelloResults.minorBans?.length || 0) > 0,
        has_blacklists: (trelloResults.blacklists?.length || 0) > 0,
        has_warrants: (trelloResults.warrants?.length || 0) > 0,
        hasSevereBans: trelloResults.hasSevereBans,
        hasMinorBans: trelloResults.hasMinorBans
      },
      group_bans: {
        severe_bans: groupBanResults.severeBanGroups,
        minor_bans: groupBanResults.minorBanGroups,
        has_severe_bans: groupBanResults.hasSevereBans,
        has_minor_bans: groupBanResults.hasMinorBans,
        tooManyGroups: groupBanResults.tooManyGroups,
        hasLimitedRanks: groupBanResults.hasLimitedRanks,
        limitedGroupCount: groupBanResults.limitedGroupCount
      }
    }
  } catch (error: any) {
    console.error('Roblox check error:', error)
    const statusCode = error.message === 'User not found' ? 404 : 500
    throw createError({
      statusCode,
      statusMessage: statusCode === 404 ? 'Not Found' : 'Internal Server Error',
      message: error.message || 'Failed to check user'
    })
  }
})
