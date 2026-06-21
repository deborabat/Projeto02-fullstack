import { Container, Navbar } from "react-bootstrap";
import { BookProvider } from "./contexts/BookContext";
import SearchForm from "./components/SearchForm";
import BookList from "./components/BookList";

export default function App() {
  return (
    <BookProvider>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>📚 Minha Biblioteca</Navbar.Brand>
        </Container>
      </Navbar>
      <Container className="py-4">
        <SearchForm />
        <BookList />
      </Container>
    </BookProvider>
  );
}
