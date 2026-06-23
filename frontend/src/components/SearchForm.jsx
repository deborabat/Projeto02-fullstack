import { useState } from 'react'
import { Form, Button, InputGroup, Alert } from 'react-bootstrap'
import { useBooks } from '../contexts/BookContext'

export default function SearchForm() {
  const { fetchBooks, error } = useBooks()
  const [query, setQuery] = useState('')
  const [validationError, setValidationError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setValidationError('')
    fetchBooks(query)
  }

  function handleClear() {
    setQuery('')
    fetchBooks('')
  }

  return (
    <Form onSubmit={handleSubmit} className="my-4">
      <InputGroup>
        <Form.Control
          placeholder="Buscar por título ou autor..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          isInvalid={!!validationError}
        />
        <Button type="submit" variant="primary">Buscar</Button>
        {query && (
          <Button variant="outline-secondary" onClick={handleClear}>
            Limpar
          </Button>
        )}
        <Form.Control.Feedback type="invalid">
          {validationError}
        </Form.Control.Feedback>
      </InputGroup>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </Form>
  )
}