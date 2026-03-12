import { defineEventHandler, getRouterParam, createError } from 'h3'
import { validateApiAccess } from '../../utils/validateApiAccess'

interface NewsArticle {
  id: string
  slug: string
  title: string
  summary: string
  content: string
  author: string
  publishedAt: string
  category: string
  featured: boolean
  tags: string[]
}

export default defineEventHandler(async event => {
  validateApiAccess(event, 'news/slug')

  try {
    const slug = getRouterParam(event, 'slug')

    if (!slug) {
      throw createError({
        status: 400,
        statusText: 'Bad Request',
        message: 'News slug is required'
      })
    }

    // Mock news articles - in a real app this would come from a database
    const newsArticles: Record<string, NewsArticle> = {
      'nusa-congress-passes-historic-legislation': {
        id: '1',
        slug: 'nusa-congress-passes-historic-legislation',
        title: 'nUSA Congress Passes Historic Legislation',
        summary:
          'The nUSA Congress today passed landmark legislation that will impact citizens across all municipalities.',
        content: `
          <h2>Historic Legislation Passed</h2>
          <p>In a historic session today, the nUSA Congress passed comprehensive legislation that addresses key issues facing our nation. The bipartisan effort represents a significant step forward in addressing the needs of all municipalities.</p>

          <h3>Key Provisions</h3>
          <ul>
            <li>Enhanced funding for municipal infrastructure</li>
            <li>Reforms to the judicial appointment process</li>
            <li>New environmental protection measures</li>
            <li>Expanded access to legal services</li>
          </ul>

          <h3>Impact</h3>
          <p>This legislation is expected to have far-reaching effects across all levels of government and will provide citizens with improved services and protections.</p>
        `,
        author: 'Congressional Press Office',
        publishedAt: '2026-03-12T10:00:00Z',
        category: 'Congress',
        featured: true,
        tags: ['congress', 'legislation', 'bipartisan']
      },
      'supreme-court-rules-constitutional-rights': {
        id: '2',
        slug: 'supreme-court-rules-constitutional-rights',
        title: 'Supreme Court Rules on Constitutional Rights Case',
        summary:
          'The Supreme Court issued a landmark ruling today clarifying constitutional rights in digital spaces.',
        content: `
          <h2>Landmark Digital Rights Ruling</h2>
          <p>The Supreme Court has issued a significant ruling that will shape the future of digital rights and online expression. The decision establishes important precedents for how constitutional rights apply in digital environments.</p>

          <h3>Key Findings</h3>
          <p>The Court determined that constitutional protections extend to digital platforms and online communications, setting new standards for privacy and free speech in the digital age.</p>

          <h3>Legal Implications</h3>
          <p>This ruling will affect how laws are interpreted and enforced across all digital platforms, requiring updates to existing legislation and enforcement practices.</p>
        `,
        author: 'Judicial Communications',
        publishedAt: '2026-03-11T15:30:00Z',
        category: 'Courts',
        featured: false,
        tags: ['supreme-court', 'constitutional-rights', 'digital']
      }
    }

    const article = newsArticles[slug]

    if (!article) {
      throw createError({
        status: 404,
        statusText: 'Not Found',
        message: 'News article not found'
      })
    }

    return article
  } catch (error) {
    console.error('Error fetching news article:', error)
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }
    throw createError({
      status: 500,
      statusText: 'Failed to fetch news article'
    })
  }
})
