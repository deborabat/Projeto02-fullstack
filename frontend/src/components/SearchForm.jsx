import { useState } from 'react'
import { Form, Button, InputGroup, Alert } from 'react-bootstrap'
import { useBooks } from '../contexts/BookContext'

export default function SearchForm() {
  const { searchBooks, error } = useBooks()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('q')
  const [validationError, setValidationError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!query.trim()) {
      setValidationError('Por favor, preencha o campo de busca.')
      return
    }
    setValidationError('')
    searchBooks(query, filter)
  }

  return (
    <Form onSubmit={handleSubmit} className="my-4">
      <Form.Group className="mb-2">
        <Form.Label>Buscar por</Form.Label>
        <Form.Select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="q">Título ou Autor</option>
          <option value="title">Título</option>
          <option value="author">Autor</option>
        </Form.Select>
      </Form.Group>

      <InputGroup>
        <Form.Control
          placeholder="Digite o título ou autor..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          isInvalid={!!validationError}
        />
        <Button type="submit" variant="primary">Buscar</Button>
        <Form.Control.Feedback type="invalid">
          {validationError}
        </Form.Control.Feedback>
      </InputGroup>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </Form>
  )
}