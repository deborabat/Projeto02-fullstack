import { useMemo, useState } from 'react'
import { Row, Col, Form, Spinner, Badge } from 'react-bootstrap'
import BookCard from './Bookcard'
import { useBooks } from '../contexts/BookContext'

export default function BookList() {
  const { books, loading } = useBooks()
  const [yearFilter, setYearFilter] = useState('')

  // useMemo: recarrega quando books ou yearFilter mudam
  const filteredBooks = useMemo(() => {
    if (!yearFilter) return books
    return books.filter(b =>
      String(b.first_publish_year).startsWith(yearFilter)
    )
  }, [books, yearFilter])

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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>
            Resultados
          </span>
          <Badge bg="primary" pill>
            {filteredBooks.length}
          </Badge>
        </div>
      <Form.Control
          style={{ width: '180px', fontSize: '13px' }}
          placeholder="Filtrar por ano..."
          value={yearFilter}
          onChange={e => setYearFilter(e.target.value)}
        />
      </div>
   {/* Grid de cards */}
      <Row xs={1} sm={2} md={3} lg={4} className="g-3">
        {filteredBooks.map((book, i) => (
          <Col key={i}>
            <BookCard book={book} />
          </Col>
        ))}
      </Row>

      {/* Nenhum resultado após filtro */}
      {filteredBooks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
          Nenhum livro encontrado para o ano "{yearFilter}"
        </div>
      )}
    </div>
  )
}