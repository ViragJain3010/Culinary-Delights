'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { drupal } from '@/lib/drupal'

export default function CrudArticleList() {
  const [articles, setArticles] = useState([])
  const [articleToDelete, setArticleToDelete] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const data = await drupal.getResourceCollection('node--article', {
        params: {
          'fields[node--article]': 'title',
          sort: '-created',
        },
      })
      setArticles(data)
    } catch (err) {
      console.error('Error fetching articles:', err)
    }
  }

  const confirmDelete = (article) => {
    setArticleToDelete(article)
    setShowModal(true)
  }

  const deleteArticle = async () => {
    if (!articleToDelete) return
    try {
      await drupal.deleteResource('node--article', articleToDelete.id)
      setArticles(articles.filter((a) => a.id !== articleToDelete.id))
      setShowModal(false)
    } catch (err) {
      console.error('Error deleting article:', err)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Articles</h1>
        <Link
          href="/crud/post"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Article
        </Link>
      </div>

      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <ul className="space-y-4">
          {articles.map((article) => (
            <li
              key={article.id}
              className="border p-4 rounded flex justify-between items-center hover:shadow"
            >
              <span className="font-medium">{article.title}</span>
              <div className="space-x-3">
                <button
                  onClick={() => router.push(`/crud/edit/${article.id}`)}
                  className="text-sm px-3 py-1 bg-yellow-400 rounded text-white hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(article)}
                  className="text-sm px-3 py-1 bg-red-600 rounded text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Delete Article?</h2>
            <p className="mb-6">
              Are you sure you want to delete{' '}
              <strong>{articleToDelete?.title}</strong>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={deleteArticle}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
