import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProgress } from "../services/api";
import { ProgressStats } from "../types";

const ProgressView = () => {
  const [progress, setProgress] = useState<ProgressStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProgress = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const stats = await fetchProgress();
        setProgress(stats);
      } catch (err) {
        console.error("Failed to fetch progress:", err);
        setError("Could not load progress data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading progress...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!progress) {
    return <div className="error-message">No progress data available.</div>;
  }

  return (
    <div className="progress-container">
      <Link to="/" className="home-return">home page</Link>
      <Link to="/practice" className="navigation">continue practice</Link>
      <h2 className="options">Learning Progress</h2>
      <p>Total Cards: {progress.totalCards}</p>
      <p>Total Practice Events: {progress.totalPracticeEvents}</p>
      <p>Success Rate: {progress.successRate.toFixed(1)}%</p>
      <p>Average Moves per Card: {progress.averageMovesPerCard.toFixed(2)}</p>

      <h3 className="options">Cards by Bucket</h3>
      <ul id="bucket-card">
        {Object.entries(progress.cardsByBucket)
          .sort((a, b) => Number(a[0]) - Number(b[0]))
          .map(([bucket, count]) => (
            <li key={bucket}>
              Index of Bucket {bucket}, Number of Flashcards {count}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ProgressView;
