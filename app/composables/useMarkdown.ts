import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'

marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    }
  })
)

marked.setOptions({
  breaks: true,
  gfm: true
})

function renderCitations(text: string): { html: string; sources: string[] } {
  const sources: string[] = []
  const citationPattern = /【(\d+):(\d+)†([^】]+)】/g

  const html = text.replace(citationPattern, (_match, _idx, _sub, source) => {
    if (!sources.includes(source)) {
      sources.push(source)
    }
    const num = sources.indexOf(source) + 1
    return `<sup class="citation" title="${source}">[${num}]</sup>`
  })

  return { html, sources }
}

function renderBracketCitations(text: string, sources: string[]): string {
  const bracketPattern = /\[(\d+):(\d+)†([^\]]+)\]/g
  return text.replace(bracketPattern, (_match, _idx, _sub, source) => {
    if (!sources.includes(source)) {
      sources.push(source)
    }
    const num = sources.indexOf(source) + 1
    return `<sup class="citation" title="${source}">[${num}]</sup>`
  })
}

export function useMarkdown() {
  const parseMarkdown = (text: string): { html: string; sources: string[] } => {
    if (!text) return { html: '', sources: [] }

    const { html: withCitations, sources } = renderCitations(text)
    const withAllCitations = renderBracketCitations(withCitations, sources)

    const parsed = marked.parse(withAllCitations) as string

    return { html: parsed, sources }
  }

  return { parseMarkdown }
}
