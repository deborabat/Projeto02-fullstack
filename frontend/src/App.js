import { useState, useCallback } from "react";
import { Container, Navbar, Button } from "react-bootstrap";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { BookProvider, useBooks } from "./contexts/BookContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import LoginForm from "./components/LoginForm";
import SearchForm from "./components/SearchForm";
import BookList from "./components/BookList";
import BookForm from "./components/BookForm";

function AppContent() {
  const { user, logout } = useAuth();
  const { fetchBooks } = useBooks();
  const [showForm, setShowForm] = useState(false);

  const handleEvent = useCallback(() => {
    fetchBooks();
  }, [fetchBooks]);

  if (!user) return <LoginForm />;

  return (
    <NotificationProvider onEvent={handleEvent}>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>📚 Minha Biblioteca</Navbar.Brand>
          <div className="d-flex align-items-center gap-3">
            <span style={{ color: "#94a3b8", fontSize: "13px" }}>
              Olá, {user.nome}
            </span>
            <Button
              size="sm"
              variant="outline-light"
              onClick={() => setShowForm(true)}
            >
              + Adicionar
            </Button>
            <Button size="sm" variant="outline-danger" onClick={logout}>
              Sair
            </Button>
          </div>
        </Container>
      </Navbar>
      <Container className="py-4">
        <SearchForm />
        <BookList />
      </Container>
      <BookForm
        show={showForm}
        onHide={() => setShowForm(false)}
        bookToEdit={null}
      />
    </NotificationProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BookProvider>
        <AppContent />
      </BookProvider>
    </AuthProvider>
  );
}
