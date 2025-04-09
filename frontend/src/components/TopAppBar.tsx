import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../pages/HomePage.css';

function TopAppBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  return (
    <nav className="nav-container">
      <div className="nav-left">
        <img src="/logo.png" alt="CineNiche Logo" className="logo" />
        <div className="nav-links">
          <Link to="/home" className="nav-link-1">
            Home
          </Link>
          <Link to="/category" className="nav-link-1">
            Categories
          </Link>
          {/* <Link to="/watchlist" className="nav-link-1">
            Watchlist
          </Link> */}
        </div>
      </div>
      <div className="nav-right">
        <div className={`search-wrapper ${isSearchOpen ? 'active' : ''}`}>
          <button
            className="search-icon"
            onClick={() => setIsSearchOpen((prev) => !prev)}
            aria-label="Toggle search"
          >
            <img
              src="/magnifying-glass.svg"
              alt="Search"
              className="search-icon-img"
            />
          </button>
          <input
            type="search"
            placeholder="Search..."
            className="search-input"
            aria-label="Search movies and TV shows"
          />
        </div>

        <svg
          width="33"
          height="33"
          viewBox="0 0 37 37"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="user-icon"
        >
          <path
            d="M30.8333 32.375V29.2917C30.8333 27.6562 30.1836 26.0876 29.0271 24.9312C27.8706 23.7747 26.3021 23.125 24.6666 23.125H12.3333C10.6978 23.125 9.12927 23.7747 7.9728 24.9312C6.81633 26.0876 6.16663 27.6562 6.16663 29.2917V32.375M24.6666 10.7917C24.6666 14.1974 21.9057 16.9583 18.5 16.9583C15.0942 16.9583 12.3333 14.1974 12.3333 10.7917C12.3333 7.38591 15.0942 4.625 18.5 4.625C21.9057 4.625 24.6666 7.38591 24.6666 10.7917Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </nav>
  );
}

export default TopAppBar;
