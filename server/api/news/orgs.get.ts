import { defineEventHandler } from 'h3'
import { newsOrgs } from '../../data/news-orgs'

export default defineEventHandler(() => {
  return newsOrgs
})
