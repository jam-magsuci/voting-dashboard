import { useState, useEffect, useCallback } from 'react'
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom'
import AudiobookDetails from './components/AudiobookDetails'
import Login from './components/Login'
import Signup from './components/SignUp'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [audiobooks, setAudiobooks] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userVotes, setUserVotes] = useState({})

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/audiobooks`, {
        credentials: 'include',
      });
      if (response.ok) {
        setIsAuthenticated(true)
        fetchAudiobooks()
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  const fetchAudiobooks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/audiobooks`, {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setAudiobooks(data)
        fetchUserVotes(data.map(book => book.id))
      } else {
        console.error('Failed to fetch audiobooks')
      }
    } catch (error) {
      console.error('Error fetching audiobooks:', error)
    }
  }

  const fetchUserVotes = async (audiobookIds) => {
    try {
      const votePromises = audiobookIds.map(id =>
        fetch(`${API_URL}/api/audiobooks/${id}/user_vote`, {
          credentials: 'include',
        }).then(res => res.json())
      )
      const voteResults = await Promise.all(votePromises)
      const newUserVotes = {}
      audiobookIds.forEach((id, index) => {
        newUserVotes[id] = voteResults[index].has_voted
      })
      setUserVotes(newUserVotes)
    } catch (error) {
      console.error('Error fetching user votes:', error)
    }
  }

  const handleVote = async (id) => {
    if (userVotes[id]) {
      alert('You have already voted for this audiobook')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/audiobooks/${id}/vote`, {
        method: 'POST',
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setAudiobooks(audiobooks.map(book => book.id === id ? data : book))
        setUserVotes(prevVotes => ({ ...prevVotes, [id]: true }))
      } else if (response.status === 400) {
        alert('You have already voted for this audiobook')
      } else {
        console.error('Failed to vote')
      }
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      if (response.ok) {
        setIsAuthenticated(false)
        setAudiobooks([])
      } else {
        console.error('Failed to logout')
      }
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true)
    fetchAudiobooks()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Router>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Audiobook Voting Dashboard</h1>
        <nav className="mb-4">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2">
                Login
              </Link>
              <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Signup
              </Link>
            </>
          )}
        </nav>
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={<Signup onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/" element={
            isAuthenticated ? (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Audiobook List</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {audiobooks.map(book => (
                    <li key={book.id} className="bg-white shadow rounded-lg p-4">
                      <img src={book.cover_image} alt={book.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                      <h3 className="text-xl font-semibold">{book.title}</h3>
                      <p className="text-gray-600">by {book.author}</p>
                      <p className="mt-2">Votes: {book.vote_count}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <Link
                          to={`/audiobook/${book.id}`}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleVote(book.id)}
                          className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${
                            userVotes[book.id] ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={userVotes[book.id]}
                        >
                          {userVotes[book.id] ? 'Already Voted' : 'Vote'}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/audiobook/:id" element={
            isAuthenticated ? <AudiobookDetails /> : <Navigate to="/login" />
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App