import { Card, Button } from 'react-bootstrap'

export default function BookCard({ book, isOwner, onEdit, onDelete }) {
  const cover = book.cover_url || null

  const cardStyle = {
    border: '0.5px solid #e2e8f0',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    height: '100%',
  }

  return (
    <Card
      style={cardStyle}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{
        height: '140px', background: cover ? 'none' : '#f1f5f9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {cover ? (
          <img src={cover} alt={book.titulo}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
            stroke="#94a3b8" strokeWidth="1.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        )}
      </div>

      <Card.Body style={{ padding: '12px 14px 14px' }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.08em',
          textTransform: 'uppercase', color: '#94a3b8', marginBottom: '4px' }}>
          {book.subject ?? 'Literatura'}
        </p>
        <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b',
          lineHeight: '1.4', marginBottom: '8px',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {book.titulo}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginTop: '4px' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            {book.autor}
          </span>
          {book.first_publish_year && (
            <span style={{ fontSize: '11px', background: '#f1f5f9',
              color: '#64748b', padding: '2px 8px', borderRadius: '20px' }}>
              {book.first_publish_year}
            </span>
          )}
        </div>

        {/* botões só para o proprietário */}
        {isOwner && (
          <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
            <Button size="sm" variant="outline-primary"
              style={{ fontSize: '11px', flex: 1 }}
              onClick={onEdit}>
              Editar
            </Button>
            <Button size="sm" variant="outline-danger"
              style={{ fontSize: '11px', flex: 1 }}
              onClick={onDelete}>
              Excluir
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}