import crypto from 'crypto'

interface ContentVersion {
  version: string
  timestamp: number
  checksum: string
  encryptedData: string
  metadata: {
    author: string
    description: string
    changeType: 'create' | 'update' | 'delete'
    affectedItems: string[]
  }
}

interface AccessControl {
  userId: string
  role: 'admin' | 'editor' | 'viewer'
  permissions: string[]
  lastAccess: number
}

interface ContentAuditLog {
  id: string
  timestamp: number
  userId: string
  action: string
  resource: string
  details: Record<string, unknown>
  checksum: string
  ipAddress: string
}

interface AnalyticsData {
  userId: string
  sessionId: string
  event: string
  data: Record<string, unknown>
  timestamp: number
  checksum: string
}

interface DiscoveryPattern {
  userId: string
  achievementId: string
  discoveryTime: number
  discoveryMethod: string
  timeSpent: number
  attempts: number
  hintsUsed: boolean
  pattern: Record<string, unknown>
}

export class SecureContentManager {
  private contentVersions: Map<string, ContentVersion[]> = new Map()
  private accessControls: Map<string, AccessControl> = new Map()
  private auditLogs: ContentAuditLog[] = []
  private analyticsData: AnalyticsData[] = []
  private discoveryPatterns: DiscoveryPattern[] = []
  private encryptionKey: string
  private checksumSalt: string

  constructor() {
    this.encryptionKey =
      process.env.CONTENT_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex')
    this.checksumSalt = process.env.CONTENT_CHECKSUM_SALT || crypto.randomBytes(16).toString('hex')
  }

  // Secure content management with access controls
  async createContent(
    contentType: string,
    data: unknown,
    userId: string,
    metadata: Record<string, unknown>
  ): Promise<string> {
    // Validate user permissions
    if (!this.hasPermission(userId, 'create', contentType)) {
      throw new Error('Insufficient permissions to create content')
    }

    // Encrypt content
    const encryptedData = this.encryptData(data)

    // Create version
    const version: ContentVersion = {
      version: this.generateVersionId(),
      timestamp: Date.now(),
      checksum: this.generateChecksum(data),
      encryptedData,
      metadata: {
        author: userId,
        description: (metadata.description as string) || '',
        changeType: 'create',
        affectedItems: (metadata.affectedItems as string[]) || []
      }
    }

    // Store version
    if (!this.contentVersions.has(contentType)) {
      this.contentVersions.set(contentType, [])
    }
    this.contentVersions.get(contentType)!.push(version)

    // Log audit trail
    this.logAuditEvent(userId, 'create', contentType, {
      version: version.version,
      itemCount: (metadata.affectedItems as string[])?.length || 0
    })

    return version.version
  }

  async updateContent(
    contentType: string,
    versionId: string,
    data: unknown,
    userId: string,
    metadata: Record<string, unknown>
  ): Promise<string> {
    // Validate permissions
    if (!this.hasPermission(userId, 'update', contentType)) {
      throw new Error('Insufficient permissions to update content')
    }

    // Get existing version
    const versions = this.contentVersions.get(contentType) || []
    const existingVersion = versions.find(v => v.version === versionId)

    if (!existingVersion) {
      throw new Error('Version not found')
    }

    // Verify integrity
    const decryptedData = this.decryptData(existingVersion.encryptedData)
    if (this.generateChecksum(decryptedData) !== existingVersion.checksum) {
      throw new Error('Content integrity verification failed')
    }

    // Create new version
    const newVersion: ContentVersion = {
      version: this.generateVersionId(),
      timestamp: Date.now(),
      checksum: this.generateChecksum(data),
      encryptedData: this.encryptData(data),
      metadata: {
        author: userId,
        description: (metadata.description as string) || '',
        changeType: 'update',
        affectedItems: (metadata.affectedItems as string[]) || []
      }
    }

    versions.push(newVersion)

    // Log audit trail
    this.logAuditEvent(userId, 'update', contentType, {
      fromVersion: versionId,
      toVersion: newVersion.version,
      changes: (metadata.changes as string[]) || []
    })

    return newVersion.version
  }

  // Access control management
  grantAccess(userId: string, role: 'admin' | 'editor' | 'viewer', permissions: string[]): void {
    const accessControl: AccessControl = {
      userId,
      role,
      permissions,
      lastAccess: Date.now()
    }

    this.accessControls.set(userId, accessControl)

    this.logAuditEvent(userId, 'grant_access', 'user_management', {
      role,
      permissions
    })
  }

  revokeAccess(userId: string): void {
    this.accessControls.delete(userId)

    this.logAuditEvent(userId, 'revoke_access', 'user_management', {
      revokedAt: Date.now()
    })
  }

  hasPermission(userId: string, action: string, resource: string): boolean {
    const accessControl = this.accessControls.get(userId)
    if (!accessControl) return false

    // Check role-based permissions
    const rolePermissions = {
      admin: ['create', 'read', 'update', 'delete', 'manage_users'],
      editor: ['create', 'read', 'update'],
      viewer: ['read']
    }

    const userPermissions = rolePermissions[accessControl.role] || []
    const specificPermissions = accessControl.permissions

    return userPermissions.includes(action) || specificPermissions.includes(`${action}:${resource}`)
  }

  // Encrypted achievement tracking analytics
  trackAnalyticsEvent(
    userId: string,
    sessionId: string,
    event: string,
    data: Record<string, unknown>
  ): void {
    const analyticsData: AnalyticsData = {
      userId,
      sessionId,
      event,
      data,
      timestamp: Date.now(),
      checksum: this.generateChecksum({ userId, sessionId, event, data, timestamp: Date.now() })
    }

    this.analyticsData.push(analyticsData)

    // Cleanup old analytics data (keep last 30 days)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    this.analyticsData = this.analyticsData.filter(a => a.timestamp > thirtyDaysAgo)
  }

  getAnalyticsData(filters?: {
    userId?: string
    event?: string
    startDate?: number
    endDate?: number
  }): AnalyticsData[] {
    let filteredData = this.analyticsData

    if (filters?.userId) {
      filteredData = filteredData.filter(a => a.userId === filters.userId)
    }

    if (filters?.event) {
      filteredData = filteredData.filter(a => a.event === filters.event)
    }

    if (filters?.startDate) {
      filteredData = filteredData.filter(a => a.timestamp >= filters.startDate)
    }

    if (filters?.endDate) {
      filteredData = filteredData.filter(a => a.timestamp <= filters.endDate)
    }

    return filteredData
  }

  // Discovery pattern tracking
  trackDiscoveryPattern(
    userId: string,
    achievementId: string,
    discoveryMethod: string,
    timeSpent: number,
    attempts: number,
    hintsUsed: boolean,
    pattern: Record<string, unknown>
  ): void {
    const discoveryPattern: DiscoveryPattern = {
      userId,
      achievementId,
      discoveryTime: Date.now(),
      discoveryMethod,
      timeSpent,
      attempts,
      hintsUsed,
      pattern
    }

    this.discoveryPatterns.push(discoveryPattern)
  }

  getDiscoveryPatterns(filters?: {
    userId?: string
    achievementId?: string
    discoveryMethod?: string
  }): DiscoveryPattern[] {
    let filteredPatterns = this.discoveryPatterns

    if (filters?.userId) {
      filteredPatterns = filteredPatterns.filter(p => p.userId === filters.userId)
    }

    if (filters?.achievementId) {
      filteredPatterns = filteredPatterns.filter(p => p.achievementId === filters.achievementId)
    }

    if (filters?.discoveryMethod) {
      filteredPatterns = filteredPatterns.filter(p => p.discoveryMethod === filters.discoveryMethod)
    }

    return filteredPatterns
  }

  // Secure backup system
  async createBackup(userId: string, includeAnalytics: boolean = false): Promise<string> {
    if (!this.hasPermission(userId, 'create', 'backup')) {
      throw new Error('Insufficient permissions to create backup')
    }

    const backupData = {
      timestamp: Date.now(),
      contentVersions: Object.fromEntries(this.contentVersions),
      accessControls: Object.fromEntries(this.accessControls),
      auditLogs: this.auditLogs,
      discoveryPatterns: includeAnalytics ? this.discoveryPatterns : [],
      checksum: ''
    }

    backupData.checksum = this.generateChecksum(backupData)

    const encryptedBackup = this.encryptData(backupData)

    this.logAuditEvent(userId, 'create_backup', 'backup', {
      includeAnalytics,
      contentTypes: Array.from(this.contentVersions.keys())
    })

    return encryptedBackup
  }

  async restoreBackup(encryptedBackup: string, userId: string): Promise<void> {
    if (!this.hasPermission(userId, 'update', 'backup')) {
      throw new Error('Insufficient permissions to restore backup')
    }

    const backupData = this.decryptData(encryptedBackup) as {
      checksum: string
      [key: string]: unknown
    }

    // Verify backup integrity
    if (backupData.checksum !== this.generateChecksum({ ...backupData, checksum: '' })) {
      throw new Error('Backup integrity verification failed')
    }

    // Restore data
    this.contentVersions = new Map(
      Object.entries(backupData.contentVersions as Record<string, ContentVersion[]>)
    )
    this.accessControls = new Map(
      Object.entries(backupData.accessControls as Record<string, AccessControl>)
    )
    this.auditLogs = (backupData.auditLogs as ContentAuditLog[]) || []
    this.discoveryPatterns = (backupData.discoveryPatterns as DiscoveryPattern[]) || []

    this.logAuditEvent(userId, 'restore_backup', 'backup', {
      backupTimestamp: backupData.timestamp,
      restoredAt: Date.now()
    })
  }

  // Dynamic difficulty adjustment
  calculateDynamicDifficulty(
    userId: string,
    recentPerformance: {
      successRate: number
      averageTime: number
      attempts: number
      [key: string]: unknown
    }
  ): {
    adjustedDifficulty: number
    recommendations: string[]
    reasoning: string
  } {
    const _analytics = this.getAnalyticsData({ userId })
    const _patterns = this.getDiscoveryPatterns({ userId })

    // Analyze recent performance
    const recentSuccessRate = (recentPerformance.successRate as number) || 0.5
    const averageTimeSpent = (recentPerformance.averageTimeSpent as number) || 30000
    const hintUsageRate = (recentPerformance.hintUsageRate as number) || 0.2

    // Calculate difficulty adjustment
    let difficultyAdjustment = 0
    const recommendations: string[] = []
    const reasoning: string[] = []

    if (recentSuccessRate > 0.8) {
      difficultyAdjustment += 0.2
      recommendations.push('Increase difficulty - player is performing well')
      reasoning.push('High success rate indicates player is ready for harder content')
    } else if (recentSuccessRate < 0.3) {
      difficultyAdjustment -= 0.3
      recommendations.push('Decrease difficulty - player is struggling')
      reasoning.push('Low success rate suggests need for easier content')
    }

    if (averageTimeSpent < 15000) {
      difficultyAdjustment += 0.1
      recommendations.push('Player is very fast - consider harder challenges')
      reasoning.push('Quick completion times suggest higher skill level')
    } else if (averageTimeSpent > 60000) {
      difficultyAdjustment -= 0.1
      recommendations.push('Player is taking long - provide hints or easier content')
      reasoning.push('Long completion times may indicate difficulty mismatch')
    }

    if (hintUsageRate > 0.5) {
      difficultyAdjustment -= 0.15
      recommendations.push('High hint usage - reduce difficulty or provide more guidance')
      reasoning.push('Frequent hint usage suggests content is too difficult')
    }

    return {
      adjustedDifficulty: Math.max(0.1, Math.min(1.0, 0.5 + difficultyAdjustment)),
      recommendations,
      reasoning: reasoning.join('; ')
    }
  }

  // Secure event logging with tamper detection
  logAuditEvent(
    userId: string,
    action: string,
    resource: string,
    details: Record<string, unknown>
  ): void {
    const auditLog: ContentAuditLog = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      userId,
      action,
      resource,
      details,
      checksum: '',
      ipAddress: 'unknown' // In production, this would come from the request
    }

    auditLog.checksum = this.generateChecksum({
      id: auditLog.id,
      timestamp: auditLog.timestamp,
      userId: auditLog.userId,
      action: auditLog.action,
      resource: auditLog.resource,
      details
    })

    this.auditLogs.push(auditLog)

    // Keep only last 90 days of logs
    const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000
    this.auditLogs = this.auditLogs.filter(log => log.timestamp > ninetyDaysAgo)
  }

  verifyAuditIntegrity(): { valid: boolean; tamperedLogs: string[] } {
    const tamperedLogs: string[] = []

    for (const log of this.auditLogs) {
      const expectedChecksum = this.generateChecksum({
        id: log.id,
        timestamp: log.timestamp,
        userId: log.userId,
        action: log.action,
        resource: log.resource,
        details: log.details
      })

      if (log.checksum !== expectedChecksum) {
        tamperedLogs.push(log.id)
      }
    }

    return {
      valid: tamperedLogs.length === 0,
      tamperedLogs
    }
  }

  // Get system-wide analytics
  getSystemAnalytics(): {
    totalUsers: number
    totalContentVersions: number
    totalAuditLogs: number
    totalAnalyticsEvents: number
    contentTypes: Record<string, number>
    userRoles: Record<string, number>
    recentActivity: {
      last24Hours: number
      last7Days: number
      last30Days: number
    }
  } {
    const now = Date.now()
    const last24Hours = now - 24 * 60 * 60 * 1000
    const last7Days = now - 7 * 24 * 60 * 60 * 1000
    const last30Days = now - 30 * 24 * 60 * 60 * 1000

    const contentTypes: Record<string, number> = {}
    for (const [contentType, versions] of this.contentVersions.entries()) {
      contentTypes[contentType] = versions.length
    }

    const userRoles: Record<string, number> = {}
    for (const accessControl of this.accessControls.values()) {
      userRoles[accessControl.role] = (userRoles[accessControl.role] || 0) + 1
    }

    const recentActivity = {
      last24Hours: this.auditLogs.filter(log => log.timestamp > last24Hours).length,
      last7Days: this.auditLogs.filter(log => log.timestamp > last7Days).length,
      last30Days: this.auditLogs.filter(log => log.timestamp > last30Days).length
    }

    return {
      totalUsers: this.accessControls.size,
      totalContentVersions: Array.from(this.contentVersions.values()).reduce(
        (total, versions) => total + versions.length,
        0
      ),
      totalAuditLogs: this.auditLogs.length,
      totalAnalyticsEvents: this.analyticsData.length,
      contentTypes,
      userRoles,
      recentActivity
    }
  }

  // Helper methods
  private encryptData(data: unknown): string {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.encryptionKey, 'hex'), iv)

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex')
    encrypted += cipher.final('hex')

    return iv.toString('hex') + ':' + encrypted
  }

  private decryptData(encryptedData: string): unknown {
    const [ivHex, encrypted] = encryptedData.split(':')
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(this.encryptionKey, 'hex'),
      iv
    )

    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return JSON.parse(decrypted)
  }

  private generateChecksum(data: unknown): string {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(data) + this.checksumSalt)
      .digest('hex')
  }

  private generateVersionId(): string {
    return 'v' + Date.now() + '-' + crypto.randomBytes(4).toString('hex')
  }
}

export const secureContentManager = new SecureContentManager()
