import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'

const BookContext = createContext()
const RESOURCE_URL = 'http://localhost:3002'

export function BookProvider({ children }) {
  const { token } = useAuth()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function headers() {
    return { authorization: `Bearer ${token}` }
  }

  const fetchBooks = useCallback(async (query = '') => {
    setLoading(true)
    setError('')
    try {
      const params = query ? { q: query } : {}
      const res = await axios.get(`${RESOURCE_URL}/books`, { headers: headers(), params })
      setBooks(res.data)
      if (res.data.length === 0) setError('Nenhum livro encontrado.')
    } catch {
      setError('Erro ao buscar livros.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) fetchBooks()
  }, [token, fetchBooks])

  async function createBook(data) {
    await axios.post(`${RESOURCE_URL}/books`, data, { headers: headers() })
    await fetchBooks()
  }

  async function updateBook(id, data) {
    await axios.put(`${RESOURCE_URL}/books/${id}`, data, { headers: headers() })
    await fetchBooks()
  }

  async function deleteBook(id) {
    await axios.delete(`${RESOURCE_URL}/books/${id}`, { headers: headers() })
    await fetchBooks()
  }

  return (
    <BookContext.Provider value={{
      books, setBooks, loading, error,
      fetchBooks, createBook, updateBook, deleteBook
    }}>
      {children}
    </BookContext.Provider>
  )
}

export function useBooks() {
  return useContext(BookContext)
}