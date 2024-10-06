import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function AudiobookDetails() {
  const [audiobook, setAudiobook] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetchAudiobook()
    checkUserVote()
  }, [id, navigate])

  const fetchAudiobook = () => {
    fetch(`${API_URL}/api/audiobooks/${id}`, {
      credentials: 'include',
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else if (response.status === 401) {
          throw new Error('Unauthorized')
        }
        throw new Error('Failed to fetch audiobook')
      })
      .then(data => setAudiobook(data))
      .catch(error => {
        if (error.message === 'Unauthorized') {
          navigate('/login')
        } else {
          console.error('Error fetching audiobook:', error)
        }
      })
  }

  const checkUserVote = () => {
    fetch(`${API_URL}/api/audiobooks/${id}/user_vote`, {
      credentials: 'include',
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else if (response.status === 401) {
          throw new Error('Unauthorized')
        }
        throw new Error('Failed to check user vote')
      })
      .then(data => setHasVoted(data.has_voted))
      .catch(error => {
        if (error.message === 'Unauthorized') {
          navigate('/login')
        } else {
          console.error('Error checking user vote:', error)
        }
      })
  }

  const handleVote = () => {
    if (hasVoted) {
      alert('You have already voted for this audiobook')
      return
    }

    fetch(`${API_URL}/api/audiobooks/${id}/vote`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else if (response.status === 401) {
          throw new Error('Unauthorized')
        } else if (response.status === 400) {
          throw new Error('Already voted')
        }
        throw new Error('Failed to vote')
      })
      .then(data => {
        setAudiobook(data)
        setHasVoted(true)
      })
      .catch(error => {
        if (error.message === 'Unauthorized') {
          navigate('/login')
        } else if (error.message === 'Already voted') {
          alert('You have already voted for this audiobook')
        } else {
          console.error('Error voting:', error)
        }
      })
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
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4 ${
                hasVoted ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={hasVoted}
            >
              {hasVoted ? 'Already Voted' : 'Vote for this Audiobook'}
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
