import { cache } from 'react'
import { cacheLife, cacheTag } from 'next/cache'

const ARTICLES = [
  {
    slug: 'getting-started',
    title: 'Getting Started with HelpDesk AI',
    excerpt: 'Learn how to submit your first ticket.',
    content: 'Welcome to HelpDesk AI. To submit a ticket...'
  },
  {
    slug: 'account-setup',
    title: 'Setting Up Your Account',
    excerpt: 'Configure your profile and preferences.',
    content: 'After signing up, navigate to Settings...'
  },
  {
    slug: 'faq',
    title: 'Frequently Asked Questions',
    excerpt: 'Answers to common questions.',
    content: 'Q: How do I reset my password? A: ...'
  }
]

function delayExecution(delay: number) {
  return new Promise((r) => setTimeout(r, delay))
}

export async function getPublishedArticles() {
  await delayExecution(200)

  return ARTICLES
}

export const getArticleBySlug = cache(async (slug: string) => {
  'use cache'
  cacheLife('hours')
  cacheTag('articles')

  return ARTICLES.find((a) => a.slug === slug) ?? null
})
