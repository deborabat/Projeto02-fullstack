import { useState } from 'react'
import { Form, Button, Alert, Card, Container } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'

export default function LoginForm() {
  const { login, error, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validationError, setValidationError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) {
      setValidationError('E-mail e senha são obrigatórios')
      return
    }
    setValidationError('')
    await login(email, password)
  }

  return (
    <Container style={{ maxWidth: '400px', marginTop: '80px' }}>
      <Card style={{ border: '0.5px solid #e2e8f0', borderRadius: '12px' }}>
        <Card.Body style={{ padding: '32px' }}>
          <h4 style={{ fontWeight: '600', marginBottom: '24px', color: '#1e293b' }}>
            📚 Minha Biblioteca
          </h4>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: '13px', color: '#64748b' }}>E-mail</Form.Label>
              <Form.Control
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                isInvalid={!!validationError}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label style={{ fontSize: '13px', color: '#64748b' }}>Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                isInvalid={!!validationError}
              />
              <Form.Control.Feedback type="invalid">
                {validationError}
              </Form.Control.Feedback>
            </Form.Group>
            {error && <Alert variant="danger" style={{ fontSize: '13px' }}>{error}</Alert>}
            <Button
              type="submit"
              variant="primary"
              className="w-100"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}