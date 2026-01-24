import { Link } from 'react-router-dom';

function ReportCard({ report }) {
  const { slug, title, description, date, tags, type } = report;

  const typeLabels = {
    visualization: 'Visualization',
    markdown: 'Article',
    html: 'Document',
  };

  return (
    <Link to={`/reports/${slug}`} className="report-card">
      <div className="report-card-header">
        <span className={`report-type type-${type}`}>
          {typeLabels[type] || type}
        </span>
        <span className="report-date">{date}</span>
      </div>
      <h3 className="report-title">{title}</h3>
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
    </Link>
  );
}

export default ReportCard;
