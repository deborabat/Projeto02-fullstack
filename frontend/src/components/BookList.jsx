import { useMemo, useState } from 'react'
import { Row, Col, Form, Spinner, Badge } from 'react-bootstrap'
import BookCard from './Bookcard'
import BookForm from './BookForm'
import { useBooks } from '../contexts/BookContext'
import { useAuth } from '../contexts/AuthContext'

export default function BookList() {
  const { books, loading, deleteBook } = useBooks()
  const { user } = useAuth()
  const [yearFilter, setYearFilter] = useState('')
  const [bookToEdit, setBookToEdit] = useState(null)
  const [showEdit, setShowEdit] = useState(false)

  const filteredBooks = useMemo(() => {
    if (!yearFilter) return books
    return books.filter(b =>
      String(b.first_publish_year).startsWith(yearFilter)
    )
  }, [books, yearFilter])

  async function handleDelete(book) {
    if (!window.confirm(`Excluir "${book.titulo}"?`)) return
    try {
      await deleteBook(book._id)
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao excluir')
    }
  }

  function handleEdit(book) {
    setBookToEdit(book)
    setShowEdit(true)
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <Spinner animation="border" variant="primary" />
        <p style={{ marginTop: '12px', color: '#94a3b8', fontSize: '14px' }}>
          Buscando livros...
        </p>
      </div>
    )
  }

  if (!books.length) return null

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px', flexWrap: 'wrap', gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>
            Resultados
          </span>
          <Badge bg="primary" pill>{filteredBooks.length}</Badge>
        </div>
        <Form.Control
          style={{ width: '180px', fontSize: '13px' }}
          placeholder="Filtrar por ano..."
          value={yearFilter}
          onChange={e => setYearFilter(e.target.value)}
        />
      </div>

      <Row xs={1} sm={2} md={3} lg={4} className="g-3">
        {filteredBooks.map((book) => (
          <Col key={book._id}>
            <BookCard
              book={book}
              isOwner={user?.id === book.proprietario}
              onEdit={() => handleEdit(book)}
              onDelete={() => handleDelete(book)}
            />
          </Col>
        ))}
      </Row>

      {filteredBooks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
          Nenhum livro encontrado para o ano "{yearFilter}"
        </div>
      )}

      <BookForm
        show={showEdit}
        onHide={() => { setShowEdit(false); setBookToEdit(null) }}
        bookToEdit={bookToEdit}
      />
    </div>
  )
}