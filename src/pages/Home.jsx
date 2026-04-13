import ReportCard from '../components/ReportCard';
import BookCard from '../components/BookCard';
import { reports } from '../reports';
import { books } from '../books';

function Home() {
  const sortedReports = [...reports].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const sortedBooks = [...books].sort(
    (a, b) => a.seriesIndex - b.seriesIndex
  );

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Instap Research</h1>
        <p className="home-subtitle">
          Data Visualization & Market Analysis
        </p>
      </header>

      <section className="reports-section">
        <h2 className="section-title">Reports</h2>
        <div className="reports-grid">
          {sortedReports.map((report) => (
            <ReportCard key={report.slug} report={report} />
          ))}
        </div>
      </section>

      <section className="books-section" id="books">
        <h2 className="section-title">Books</h2>
        <div className="books-grid">
          {sortedBooks.map((book) => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
