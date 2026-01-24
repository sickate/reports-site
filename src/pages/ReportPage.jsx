import { useParams, Link } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import { reports } from '../reports';

function ReportPage() {
  const { slug } = useParams();
  const [ReportComponent, setReportComponent] = useState(null);
  const [error, setError] = useState(null);

  const report = reports.find((r) => r.slug === slug);

  useEffect(() => {
    if (report?.component) {
      setError(null);
      report
        .component()
        .then((module) => {
          setReportComponent(() => module.default);
        })
        .catch((err) => {
          console.error('Failed to load report:', err);
          setError('Unable to load report component');
        });
    }
  }, [slug, report]);

  if (!report) {
    return (
      <div className="report-not-found">
        <h2>Report Not Found</h2>
        <p>The report "{slug}" does not exist.</p>
        <Link to="/" className="back-link">
          Back to Home
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-error">
        <h2>Loading Error</h2>
        <p>{error}</p>
        <Link to="/" className="back-link">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="report-page">
      <div className="report-nav">
        <Link to="/" className="back-link">
          &larr; Back to Reports
        </Link>
      </div>
      <Suspense
        fallback={
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading report...</p>
          </div>
        }
      >
        {ReportComponent && <ReportComponent />}
      </Suspense>
    </div>
  );
}

export default ReportPage;
