import { useState, useEffect } from 'react'
import { Modal, Form, Button, Alert } from 'react-bootstrap'
import { useBooks } from '../contexts/BookContext'

export default function BookForm({ show, onHide, bookToEdit }) {
  const { createBook, updateBook } = useBooks()
  const [form, setForm] = useState({ titulo: '', autor: '', subject: '', first_publish_year: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (bookToEdit) {
      setForm({
        titulo: bookToEdit.titulo || '',
        autor: bookToEdit.autor || '',
        subject: bookToEdit.subject || '',
        first_publish_year: bookToEdit.first_publish_year || '',
      })
    } else {
      setForm({ titulo: '', autor: '', subject: '', first_publish_year: '' })
    }
    setError('')
  }, [bookToEdit, show])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.titulo || !form.autor) {
      setError('Título e autor são obrigatórios')
      return
    }
    setLoading(true)
    try {
      if (bookToEdit) {
        await updateBook(bookToEdit._id, form)
      } else {
        await createBook(form)
      }
      onHide()
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar livro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: '16px', fontWeight: '600' }}>
          {bookToEdit ? 'Editar Livro' : 'Adicionar Livro'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger" style={{ fontSize: '13px' }}>{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Título *</Form.Label>
            <Form.Control
              value={form.titulo}
              onChange={e => setForm({ ...form, titulo: e.target.value })}
              placeholder="Título do livro"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Autor *</Form.Label>
            <Form.Control
              value={form.autor}
              onChange={e => setForm({ ...form, autor: e.target.value })}
              placeholder="Nome do autor"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Gênero</Form.Label>
            <Form.Control
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              placeholder="Ex: Romance, Ficção..."
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ano de publicação</Form.Label>
            <Form.Control
              type="number"
              value={form.first_publish_year}
              onChange={e => setForm({ ...form, first_publish_year: e.target.value })}
              placeholder="Ex: 2024"
            />
          </Form.Group>
          <div className="d-flex gap-2 justify-content-end mt-4">
            <Button variant="outline-secondary" onClick={onHide}>Cancelar</Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}