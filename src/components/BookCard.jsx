import { Link } from 'react-router-dom';

function BookCard({ book }) {
  const { slug, title, subtitle, author, description, series, status, tags } = book;
  const isAvailable = status === 'available';

  const content = (
    <>
      <div className="report-card-header">
        <span className="report-type type-book">Book</span>
        <span className="report-date">{series}</span>
      </div>
      <h3 className="report-title">{title}</h3>
      {subtitle !== title && (
        <p className="book-subtitle">{subtitle}</p>
      )}
      <p className="book-author">{author}</p>
      <p className="report-description">{description}</p>
      {tags && tags.length > 0 && (
        <div className="report-tags">
          {tags.map((tag, index) => (
            <span key={index} className="report-tag">
              {tag}
            </span>
          ))}
        </div>
      )}
      {!isAvailable && (
        <span className="book-coming-soon">Coming Soon</span>
      )}
    </>
  );

  if (!isAvailable) {
    return (
      <div className="report-card book-card book-card-disabled">
        {content}
      </div>
    );
  }

  return (
    <Link to={`/books/${slug}`} className="report-card book-card">
      {content}
    </Link>
  );
}

export default BookCard;
