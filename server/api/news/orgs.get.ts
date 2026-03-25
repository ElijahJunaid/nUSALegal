import { defineEventHandler } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'
import { newsOrgs } from '../../data/news-orgs'

export default defineEventHandler(async event => {
  validateApiAccess(event, 'news/orgs')
  return newsOrgs
})
