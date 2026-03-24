import { defineEventHandler, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'
import { dError } from '../../utils/debug'

export default defineEventHandler(async event => {
  validateApiAccess(event, 'news/index')

  try {
    // Mock news data - in a real app this would come from a database
    const news = [
      {
        id: '1',
        title: 'nUSA Congress Passes Historic Legislation',
        summary:
          'The nUSA Congress today passed landmark legislation that will impact citizens across all municipalities.',
        content:
          'In a historic session today, the nUSA Congress passed comprehensive legislation that addresses key issues facing our nation...',
        author: 'Congressional Press Office',
        publishedAt: '2026-03-12T10:00:00Z',
        category: 'Congress',
        featured: true
      },
      {
        id: '2',
        title: 'Supreme Court Rules on Constitutional Rights Case',
        summary:
          'The Supreme Court issued a landmark ruling today clarifying constitutional rights in digital spaces.',
        content:
          'The Supreme Court has issued a significant ruling that will shape the future of digital rights and online expression...',
        author: 'Judicial Communications',
        publishedAt: '2026-03-11T15:30:00Z',
        category: 'Courts',
        featured: false
      },
      {
        id: '3',
        title: 'Executive Order Reforms Federal Agency Structure',
        summary:
          'The President signed an executive order today restructuring key federal agencies for improved efficiency.',
        content:
          'President [Name] today signed Executive Order [Number], implementing comprehensive reforms to federal agency structures...',
        author: 'Executive Office',
        publishedAt: '2026-03-10T09:15:00Z',
        category: 'Executive',
        featured: false
      },
      {
        id: '4',
        title: 'Department of Justice Announces New Crime Prevention Initiative',
        summary:
          'The DOJ announced a comprehensive new initiative aimed at reducing crime rates through community partnerships.',
        content:
          'The Department of Justice unveiled a new crime prevention strategy that focuses on community engagement and proactive policing...',
        author: 'DOJ Press Office',
        publishedAt: '2026-03-09T14:00:00Z',
        category: 'Justice',
        featured: false
      },
      {
        id: '5',
        title: 'Federal Court System Implements Digital Case Management',
        summary:
          'Federal courts are transitioning to a fully digital case management system to improve access and efficiency.',
        content:
          'The federal court system has begun implementing a comprehensive digital case management platform that will modernize how cases are filed and processed...',
        author: 'Administrative Office',
        publishedAt: '2026-03-08T11:45:00Z',
        category: 'Courts',
        featured: false
      }
    ]

    return news
  } catch (error) {
    dError('Error fetching news:', error)
    throw createError({
      status: 500,
      statusText: 'Failed to fetch news'
    })
  }
})
