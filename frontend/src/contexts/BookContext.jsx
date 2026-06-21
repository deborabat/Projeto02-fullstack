import { createContext, useContext, useState } from 'react'

const BookContext = createContext()

export function BookProvider({ children }) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function searchBooks(query) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`
      )
      const data = await res.json()
      if (data.docs.length === 0) {
        setError('Nenhum livro encontrado.')
        setBooks([])
      } else {
        setBooks(data.docs)
      }
    } catch {
      setError('Erro ao buscar livros. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <BookContext.Provider value={{ books, loading, error, searchBooks }}>
      {children}
    </BookContext.Provider>
  )
}

export function useBooks() {
  return useContext(BookContext)
}