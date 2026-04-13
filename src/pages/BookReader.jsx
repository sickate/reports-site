import { useParams, Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { books } from '../books';

function BookReader() {
  const { slug } = useParams();
  const iframeRef = useRef(null);
  const book = books.find((b) => b.slug === slug);

  useEffect(() => {
    document.body.classList.add('book-reader-active');
    return () => {
      document.body.classList.remove('book-reader-active');
    };
  }, []);

  if (!book || book.status !== 'available') {
    return (
      <div className="report-not-found">
        <h2>Book not found</h2>
        <p>The book you're looking for doesn't exist or isn't available yet.</p>
        <Link to="/#books" className="back-link">Back to Books</Link>
      </div>
    );
  }

  return (
    <div className="book-reader-page">
      <nav className="book-reader-nav">
        <Link to="/#books" className="back-link">
          &larr; Back
        </Link>
      </nav>
      <iframe
        ref={iframeRef}
        src={book.htmlPath}
        className="book-reader-iframe"
        title={book.title}
        onLoad={() => iframeRef.current?.focus()}
      />
    </div>
  );
}

export default BookReader;
