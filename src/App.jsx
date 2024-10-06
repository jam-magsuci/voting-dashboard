import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [items, setItems] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/api/hello')
      .then(response => response.json())
      .then(data => setMessage(data.message))

    fetch('http://localhost:5000/api/items')
      .then(response => response.json())
      .then(data => setItems(data))
  }, [])

  return (
    <>
      <h1>{message}</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </>
  )
}

export default App
