

interface GroupBanResults {
  hasSevereBans: boolean
  hasMinorBans: boolean
  tooManyGroups: boolean
  hasLimitedRanks: boolean
  severeBanGroups: GroupInfo[]
  minorBanGroups: GroupInfo[]
  limitedGroupCount: number
  limitedGroups: GroupInfo[]
  limitedRankGroups: GroupInfo[]
}

interface GroupInfo {
  group_id: number
  group_name: string
  role: string
}

interface RobloxGroup {
  Id: number
  Name: string
  Role: string
}

const bannedGroups = {
  severeBans: [] as number[],
  minorBans: [] as number[],
  limitedGroups: [
    3130067, 3842918, 761943, 905999, 816616, 759572,
    766074, 761141, 977773, 761706, 2900057, 792297,
    761515, 860594, 1252274, 845643
  ],
  limitedRanks: [] as string[],
  excludedRanks: [
    "Suspended", "Vice President", "President", "Community Oversight",
    "Founder", "Protectee", "American Online", "Agency Oversight",
    "Foreign Leader", "Department Oversight", "Representative",
    "Oversight Staff", "Business Owners"
  ]
}

export async function checkGroupBans(groups: RobloxGroup[]): Promise<GroupBanResults> {
  const results: GroupBanResults = {
    hasSevereBans: false,
    hasMinorBans: false,
    tooManyGroups: false,
    hasLimitedRanks: false,
    severeBanGroups: [],
    minorBanGroups: [],
    limitedGroupCount: 0,
    limitedGroups: [],
    limitedRankGroups: []
  }

  for (const group of groups) {
    
    if (bannedGroups.severeBans.includes(group.Id)) {
      results.hasSevereBans = true
      results.severeBanGroups.push({
        group_id: group.Id,
        group_name: group.Name,
        role: group.Role
      })
    }

    if (bannedGroups.minorBans.includes(group.Id)) {
      results.hasMinorBans = true
      results.minorBanGroups.push({
        group_id: group.Id,
        group_name: group.Name,
        role: group.Role
      })
    }

    if (bannedGroups.limitedGroups.includes(group.Id)) {
      if (!bannedGroups.excludedRanks.includes(group.Role)) {
        results.limitedGroups.push({
          group_id: group.Id,
          group_name: group.Name,
          role: group.Role
        })
      }

      if (bannedGroups.limitedRanks.includes(group.Role)) {
        results.hasLimitedRanks = true
        results.limitedRankGroups.push({
          group_id: group.Id,
          group_name: group.Name,
          role: group.Role
        })
      }
    }
  }

  results.limitedGroupCount = results.limitedGroups.length
  results.tooManyGroups = results.limitedGroupCount > 3

  return results
}

export { bannedGroups }
