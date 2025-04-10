import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../pages/HomePage.css';
import Logout from './Logout';
import { AuthorizedUser } from './AuthorizeView';
import { changeGenreName, formatGenreName } from '../utils/genreHelpers';

function TopAppBar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // const [user, setUser] = useState<any>(null); // Store user info with roles
    const menuRef = useRef<HTMLDivElement>(null);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categoryRef = useRef<HTMLDivElement>(null);
  // Fetch genres
  useEffect(() => {
    async function fetchGenres() {
      const response = await fetch('https://localhost:5000/api/Movie/GetMovieTypes', {
        credentials: 'include',
      });
      const data = await response.json();
      setGenres(data);
    }
    fetchGenres();
  }, []);

  

  // Check if user is admin
  useEffect(() => {
    const userEmail = localStorage.getItem('username');
    if (!userEmail) return;

    async function checkAdmin() {
      try {
        const res = await fetch(
          `https://localhost:5000/Role/CheckRoleByEmail/${userEmail}`,
          {
            credentials: 'include',
          }
        );
        const isAdminResponse = await res.text();
        if(isAdminResponse === "User is an admin ✅"){setIsAdmin(true)};
      } catch (err) {
        console.error('Error checking admin status:', err);
      }
    }

    checkAdmin();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };


  return (
    <nav className="nav-container">
      <div className="nav-left">
        <img src="/logo.png" alt="CineNiche Logo" className="logo" />
        <div className="nav-links">
          <Link to="/home" className="nav-link-1">
            Home
          </Link>
          <div className="dropdown-container" ref={categoryRef}>
            <button
              className="nav-link-1 dropdown-trigger"
              onClick={() => setIsCategoryOpen((prev) => !prev)}
            >
              Categories
            </button>
            {isCategoryOpen && (
              <div className="category-dropdown">
                {genres.map((genre) => (
                  <Link
                    key={genre}
                    to={`/category/${genre}`}
                    className="dropdown-item"
                    onClick={() => setIsCategoryOpen(false)} // Close on click
                  >
                    {formatGenreName(changeGenreName(genre))}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
            {/* Conditionally render the Admin button */}
            {isAdmin && (
        <div className="admin-button-container">
          <Link to="/admin" className="admin-button">
            Admin
          </Link>
        </div>
      )}

      <div className="nav-right">
        <form
          onSubmit={handleSearchSubmit}
          className={`search-wrapper ${isSearchOpen ? 'active' : ''}`}
        >
          <button
            type="button"
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="search-input"
            aria-label="Search movies and TV shows"
          />
        </form>

        <div className="user-icon-wrapper" ref={menuRef}>
          <svg
            width="33"
            height="33"
            viewBox="0 0 37 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="user-icon"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            style={{ cursor: 'pointer' }}
          >
            <path
              d="M30.8333 32.375V29.2917C30.8333 27.6562 30.1836 26.0876 29.0271 24.9312C27.8706 23.7747 26.3021 23.125 24.6666 23.125H12.3333C10.6978 23.125 9.12927 23.7747 7.9728 24.9312C6.81633 26.0876 6.16663 27.6562 6.16663 29.2917V32.375M24.6666 10.7917C24.6666 14.1974 21.9057 16.9583 18.5 16.9583C15.0942 16.9583 12.3333 14.1974 12.3333 10.7917C12.3333 7.38591 15.0942 4.625 18.5 4.625C21.9057 4.625 24.6666 7.38591 24.6666 10.7917Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {isMenuOpen && (
            <div className="user-dropdown">
              <Logout>
                Log out <AuthorizedUser value="email" />
              </Logout>
            </div>
          )}
        </div>
      </div>


    </nav>
  );
}

export default TopAppBar;
