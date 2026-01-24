import ReportCard from '../components/ReportCard';
import { reports } from '../reports';

function Home() {
  const sortedReports = [...reports].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
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
    </div>
  );
}

export default Home;
