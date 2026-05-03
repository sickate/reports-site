import ReportCard from '../components/ReportCard';
import BookCard from '../components/BookCard';
import { reports, REPORT_CATEGORIES } from '../reports';
import { books } from '../books';

function Home() {
  const sortedReports = [...reports].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Group reports by category, preserving date desc within each group.
  const groupedReports = REPORT_CATEGORIES.reduce((acc, cat) => {
    acc[cat.key] = sortedReports.filter((r) => r.category === cat.key);
    return acc;
  }, {});

  // Catch any reports missing a category — surface them in 'company' as fallback.
  const uncategorized = sortedReports.filter(
    (r) => !REPORT_CATEGORIES.some((c) => c.key === r.category)
  );
  if (uncategorized.length > 0) {
    groupedReports.company = [...uncategorized, ...(groupedReports.company || [])];
  }

  const sortedBooks = [...books].sort(
    (a, b) => a.seriesIndex - b.seriesIndex
  );

  const primaryCategories = REPORT_CATEGORIES.filter((c) => !c.collapsed);
  const collapsedCategories = REPORT_CATEGORIES.filter((c) => c.collapsed);

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Instap Research</h1>
        <p className="home-subtitle">
          Data Visualization & Market Analysis
        </p>
      </header>

      {/* Primary categories: company / industry / viz */}
      {primaryCategories.map((cat) => {
        const items = groupedReports[cat.key] || [];
        if (items.length === 0) return null;
        return (
          <section key={cat.key} className="category-section">
            <div className="category-header">
              <h2 className="category-title">
                <span className="category-icon">{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="category-count">{items.length}</span>
              </h2>
              <p className="category-description">{cat.description}</p>
            </div>
            <div className="reports-grid">
              {items.map((report) => (
                <ReportCard key={report.slug} report={report} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Collapsed: reading + Books series */}
      <details className="collapsed-section">
        <summary className="collapsed-summary">
          <span className="collapsed-summary-content">
            {collapsedCategories.map((cat) => (
              <span key={cat.key} className="collapsed-summary-tag">
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="category-count category-count-sm">
                  {groupedReports[cat.key]?.length || 0}
                </span>
              </span>
            ))}
            <span className="collapsed-summary-tag">
              <span>📖</span>
              <span>Books 系列</span>
              <span className="category-count category-count-sm">{sortedBooks.length}</span>
            </span>
          </span>
          <span className="collapsed-chevron">▼</span>
        </summary>
        <div className="collapsed-body">
          {collapsedCategories.map((cat) => {
            const items = groupedReports[cat.key] || [];
            if (items.length === 0) return null;
            return (
              <div key={cat.key} className="collapsed-subsection">
                <h3 className="collapsed-subtitle">
                  <span className="category-icon">{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className="collapsed-subtitle-desc">· {cat.description}</span>
                </h3>
                <div className="reports-grid">
                  {items.map((report) => (
                    <ReportCard key={report.slug} report={report} />
                  ))}
                </div>
              </div>
            );
          })}

          {sortedBooks.length > 0 && (
            <div className="collapsed-subsection" id="books">
              <h3 className="collapsed-subtitle">
                <span className="category-icon">📖</span>
                <span>Books</span>
                <span className="collapsed-subtitle-desc">· 长篇小说在线阅读</span>
              </h3>
              <div className="books-grid">
                {sortedBooks.map((book) => (
                  <BookCard key={book.slug} book={book} />
                ))}
              </div>
            </div>
          )}
        </div>
      </details>
    </div>
  );
}

export default Home;
