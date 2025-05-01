import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <h1 id="welcome">Welcome to Flashcard Learner</h1>
      <div className="home-options">
        <Link to="/practice" className="options">Practice</Link>
        <Link to="/progress" className="options">View Progress</Link>
      </div>
    </div>
  );
};

export default HomePage;
