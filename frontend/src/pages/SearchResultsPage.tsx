import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../pages/CategoryMoviePage.css'; // Import the CSS
import TopAppBar from '../components/TopAppBar';
import { Movie } from '../types/Movie';
import getResultsFromSearch from '../utils/getResultsFromSearch';
import AuthorizeView from '../components/AuthorizeView';
import MovieModal from './MovieModal';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResultsPage() {
  const query = useQuery();
  const searchTerm = query.get('q');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // IntersectionObserver to trigger lazy load
  const observer = useRef<IntersectionObserver | null>(null);

  const lastMovieRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return; // Prevent observer from triggering while loading

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => prevPage + 1); // Increment page number to load more
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // Reset movies and page when search term changes
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [searchTerm]);

  // Fetch movies when page or search term changes
  useEffect(() => {
    const fetchMovies = async () => {
      if (!searchTerm || !hasMore) return;

      setIsLoading(true);
      const newMovies = await getResultsFromSearch(searchTerm, page, 20);
      setMovies(prev => [...prev, ...newMovies]);
      setIsLoading(false);

      if (newMovies.length < 20) setHasMore(false); // No more data to load
    };

    fetchMovies();
  }, [searchTerm, page, hasMore]);

  return (
    <AuthorizeView>
    <div> 
      <TopAppBar />
      <h2>Search Results for: {searchTerm}</h2>
      <div className="home-thing-1">
        <div className="home-slice-1">
          <div className="movie-grid">
            {movies.map((movie, index) => {
              const isLast = index === movies.length - 1;
              return (
                <div
                  key={movie.show_id}
                  className="movie-card"
                  ref={isLast ? lastMovieRef : null}
                >
                  <div 
                    onClick={() => setSelectedMovie(movie)}
                    style={{ cursor: 'pointer' }}>
                  {/* <Link to={`/movies/${movie.show_id}`} state={{ movie }}> */}
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="movie-poster"
                    />
                  {/* </Link> */}
            
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {isLoading && <p style={{ textAlign: 'center' }}>Loading...</p>}
      </div>
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onMovieSelect={(newMovie) => setSelectedMovie(newMovie)}
        />
      )}
    </div>
    </AuthorizeView>
  );
}

export default SearchResultsPage;
