'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { drupal } from '@/lib/drupal'

export default function EditArticlePage({ params }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [article, setArticle] = useState(null)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await drupal.getResource('node--article', params.id, {
          params: {
            include: 'field_image',
          },
        })

        setTitle(data.title)
        setBody(data.body?.value || '')
        setArticle(data)
      } catch (err) {
        console.error('Error fetching article:', err)
      }
    }

    fetchArticle()
  }, [params.id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await drupal.updateResource('node--article', params.id, {
        data: {
          attributes: {
            title,
            body: {
              value: body,
              format: 'plain_text',
            },
          },
        },
      })

      router.push('/crud')
    } catch (err) {
      console.error('Error updating article:', err)
    }
  }

  if (!article) {
    return <p className="p-4">Loading...</p>
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Edit Article</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full border px-3 py-2 rounded h-40"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Article
        </button>
      </form>
    </div>
  )
}
