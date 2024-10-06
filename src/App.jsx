import { useState, useEffect } from 'react'

function App() {
  const [audiobooks, setAudiobooks] = useState([])
  const [selectedAudiobook, setSelectedAudiobook] = useState(null)

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
        if (selectedAudiobook && selectedAudiobook.id === id) {
          setSelectedAudiobook(data)
        }
      })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Audiobook Voting Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Audiobook List</h2>
          <ul className="space-y-4">
            {audiobooks.map(book => (
              <li key={book.id} className="bg-white shadow rounded-lg p-4">
                <h3 className="text-xl font-semibold">{book.title}</h3>
                <p className="text-gray-600">by {book.author}</p>
                <p className="mt-2">Votes: {book.vote_count}</p>
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => setSelectedAudiobook(book)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    View Details
                  </button>
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
        <div>
          <h2 className="text-2xl font-semibold mb-4">Audiobook Details</h2>
          {selectedAudiobook ? (
            <div className="bg-white shadow rounded-lg p-6">
              <img src={selectedAudiobook.cover_image} alt={selectedAudiobook.title} className="w-full h-64 object-cover rounded-lg mb-4" />
              <h3 className="text-2xl font-semibold">{selectedAudiobook.title}</h3>
              <p className="text-gray-600">by {selectedAudiobook.author}</p>
              <p className="mt-2">{selectedAudiobook.description}</p>
              <p className="mt-4 font-semibold">Votes: {selectedAudiobook.vote_count}</p>
            </div>
          ) : (
            <p className="text-gray-600">Select an audiobook to view details</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
