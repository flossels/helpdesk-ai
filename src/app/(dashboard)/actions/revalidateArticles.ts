'use server'

import { updateTag } from 'next/cache'

const revalidateArticles = async () => updateTag('articles')

export default revalidateArticles
