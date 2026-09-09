import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-indigo-600">404</h1>
        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl mt-4">
          Uh-oh!
        </p>
        <p className="mt-4 text-gray-500">
          We can't find that page.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-block bg-indigo-600 px-5 py-3 text-sm font-medium text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring transition-colors"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
