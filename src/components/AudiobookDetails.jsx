import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

function AudiobookDetails() {
  const [audiobook, setAudiobook] = useState(null)
  const { id } = useParams()

  useEffect(() => {
    fetch(`http://localhost:5000/api/audiobooks/${id}`)
      .then(response => response.json())
      .then(data => setAudiobook(data))
  }, [id])

  const handleVote = () => {
    fetch(`http://localhost:5000/api/audiobooks/${id}/vote`, { method: 'POST' })
      .then(response => response.json())
      .then(data => setAudiobook(data))
  }

  if (!audiobook) {
    return <div className="text-center mt-8">Loading...</div>
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img className="h-48 w-full object-cover md:w-48" src={audiobook.cover_image} alt={audiobook.title} />
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{audiobook.author}</div>
          <h2 className="block mt-1 text-lg leading-tight font-medium text-black">{audiobook.title}</h2>
          <p className="mt-2 text-gray-500">{audiobook.description}</p>
          <div className="mt-4">
            <span className="text-gray-600">Votes: </span>
            <span className="font-bold">{audiobook.vote_count}</span>
          </div>
          <div className="mt-6 flex items-center">
            <button
              onClick={handleVote}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
            >
              Vote for this Audiobook
            </button>
            <Link
              to="/"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Back to List
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AudiobookDetails
