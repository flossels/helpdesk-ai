'use server'

import { revalidateTag } from 'next/cache'

const revalidateArticles = async () => revalidateTag('articles', 'max')

export default revalidateArticles
