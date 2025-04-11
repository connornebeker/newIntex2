import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Movie } from '../types/Movie';
import TopAppBar from '../components/TopAppBar';
import '../pages/CategoryMoviePage.css';
import getMoviesOneGenre from '../utils/getMovieFromGenre';
import AuthorizeView from '../components/AuthorizeView';
import MovieModal from './MovieModal';

export default function CategoryMoviePage() {
  const { categoryName } = useParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  // Function to be called when the last movie in the list is visible in the viewport
  const lastMovieRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      // Create a new IntersectionObserver instance
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1); // Load more movies when the last movie is in view
        }
      });

      // Observe the last movie node
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // resets state when the category changes
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [categoryName]);

  // fetch movies when the component mounts or when the page changes
  useEffect(() => {
    async function fetchMovies() {
      if (!categoryName || !hasMore) return;

      setIsLoading(true);
      const newMovies = await getMoviesOneGenre(categoryName, page, 20);
      setMovies((prev) => [...prev, ...newMovies]);
      setIsLoading(false);

      if (newMovies.length < 20) setHasMore(false); // No more data
    }

    fetchMovies();
  }, [categoryName, page]);

  return (
    <AuthorizeView>
      <div>
        <TopAppBar />
        <div className="home-container-1">
          <div className="category-page-wrapper">
            <h2 className="category-title">{categoryName}</h2>
            <div className="home-content-1">
              <div className="movie-grid-wrapper">
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
                          style={{ cursor: 'pointer' }}
                        >
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="movie-poster"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
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
