import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import TopAppBar from '../components/TopAppBar';
import AuthorizeView from '../components/AuthorizeView';
import { Movie } from '../types/Movie';
import fetchPoster from '../utils/fetchPoster';
import { changeGenreName, formatGenreName } from '../utils/genreHelpers';
import AdminModal from './AdminModal';
import AddModal from './AddModal';

const AdminPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showForm, setShowForm] = useState(false); // needed for the add movie form

  // calls fetch genres
  useEffect(() => {
    fetchGenres();
  }, []);

  // resets the current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGenres, selectedLetters, pageSize, searchTerm]);

  // fetches movies based on filters and search term
  useEffect(() => {
    fetchFilteredMovies();
  }, [selectedGenres, selectedLetters, currentPage, pageSize, searchTerm]);

  // fetches all genres from the backend
  const fetchGenres = async () => {
    try {
      const res = await fetch(
        'https://intex-group2-7-backend-duahbmbxaggha8e2.eastus-01.azurewebsites.net/api/Movie/GetMovieTypes',
        {
          credentials: 'include',
        }
      );
      const data = await res.json();
      setGenres(data);
    } catch (err) {
      console.error('Error fetching genres', err);
    }
  };

  // retrieves movies based on filter
  const fetchFilteredMovies = async () => {
    // filters by letters and genres
    try {
      const params = new URLSearchParams();
      selectedGenres.forEach((g) => params.append('movieTypes', g));
      selectedLetters.forEach((l) => params.append('startsWithLetters', l));
      if (searchTerm.trim()) params.append('searchTerm', searchTerm.trim());
      params.append('page', currentPage.toString());
      params.append('pageSize', pageSize.toString());

      const query = `https://intex-group2-7-backend-duahbmbxaggha8e2.eastus-01.azurewebsites.net/api/Movie/AllMoviesPaginated?${params.toString()}`;
      const res = await fetch(query, { credentials: 'include' });
      const result = await res.json();

      const withPosters = result.movies.map((movie: Movie) => ({
        ...movie,
        posterUrl: fetchPoster(
          movie.title
            .normalize('NFD')
            .replace(/[:'()’!.&-]/g, '')
            .trim()
        ),
      }));

      setMovies(withPosters);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error('Error fetching movies', err);
    }
  };

  // lets user click on genre to filter
  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  // lets user click on letter to filter
  const toggleLetter = (letter: string) => {
    setSelectedLetters((prev) =>
      prev.includes(letter)
        ? prev.filter((l) => l !== letter)
        : [...prev, letter]
    );
  };

  // removes filter when user clicks on "x"
  const removeFilter = (type: 'genre' | 'letter', value: string) => {
    if (type === 'genre') {
      setSelectedGenres((prev) => prev.filter((g) => g !== value));
    } else {
      setSelectedLetters((prev) => prev.filter((l) => l !== value));
    }
  };

  // filters movies based on search term
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // genre display formatting
  const genreRows = [];
  const genresPerRow = Math.ceil(genres.length / 2);
  for (let i = 0; i < 2; i++) {
    genreRows.push(genres.slice(i * genresPerRow, (i + 1) * genresPerRow));
  }

  return (
    <AuthorizeView>
      <div className="admin-container">
        <TopAppBar />
        <main className="admin-content">
          <h1 className="admin-title">Admin Manager</h1>

          <div
            className="search-section"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="Search movies or TV shows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />

            {searchTerm && (
              <span
                className="clear-search"
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  left: '49.3rem', // controls how close to "+" button
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  fontSize: '1.3rem',
                  color: '#888',
                  zIndex: 10,
                }}
              >
                ×
              </span>
            )}

            <button onClick={() => setShowForm(true)} className="add-button">
              ＋
            </button>
          </div>

          <div className="filter-label">Filter by Genre</div>
          <div className="genre-carousel">
            <div className="genre-scroll-wrapper">
              {genres.map((genre) => {
                const label = formatGenreName(changeGenreName(genre));
                return (
                  <button
                    key={genre}
                    className={`filter-button ${selectedGenres.includes(genre) ? 'active' : ''}`}
                    onClick={() => toggleGenre(genre)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="filter-label">Filter by Title</div>
          <div className="letter-filters">
            {alphabet.map((letter) => (
              <button
                key={letter}
                className={`filter-button ${selectedLetters.includes(letter) ? 'active' : ''}`}
                onClick={() => toggleLetter(letter)}
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="filter-tags">
            {selectedGenres.map((genre) => (
              <span className="filter-tag" key={genre}>
                {formatGenreName(changeGenreName(genre))}{' '}
                <button onClick={() => removeFilter('genre', genre)}>✕</button>
              </span>
            ))}
            {selectedLetters.map((letter) => (
              <span className="filter-tag" key={letter}>
                {letter}{' '}
                <button onClick={() => removeFilter('letter', letter)}>
                  ✕
                </button>
              </span>
            ))}
          </div>

          <div className="movie-grid-1">
            {filteredMovies.map((movie) => (
              <div key={movie.show_id} className="action-card">
                <div className="action-image-container">
                  <div
                    onClick={() => setSelectedMovie(movie)}
                    style={{ cursor: 'pointer' }}
                  >
                    {movie.posterUrl ? (
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        onError={(e) => {
                          const fallbackUrl = `https://dummyimage.com/300x450/cccccc/000000&text=${encodeURIComponent(movie.title)}`;
                          (e.target as HTMLImageElement).src = fallbackUrl;
                        }}
                        className="action-image"
                      />
                    ) : (
                      <div className="no-poster-placeholder">{movie.title}</div>
                    )}
                    <div className="action-overlay">{movie.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination-controls">
            <div className="pagination-top">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 50].map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
          </div>
        </main>
        {selectedMovie && (
          <AdminModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}
        {showForm && (
          <div className="form-modal">
            <AddModal onClose={() => setShowForm(false)} />
            <button onClick={() => setShowForm(false)}>Close</button>
          </div>
        )}
      </div>
    </AuthorizeView>
  );
};

export default AdminPage;
