import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import AudiobookDetails from './components/AudiobookDetails'

function App() {
  const [audiobooks, setAudiobooks] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/api/audiobooks')
      .then(response => response.json())
      .then(data => setAudiobooks(data))
  }, [])

  const handleVote = (id) => {
    fetch(`http://localhost:5000/api/audiobooks/${id}/vote`, { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        setAudiobooks(audiobooks.map(book => book.id === id ? data : book))
      })
  }

  return (
    <Router>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Audiobook Voting Dashboard</h1>
        <Routes>
          <Route path="/" element={
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
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Vote
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          } />
          <Route path="/audiobook/:id" element={<AudiobookDetails />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
