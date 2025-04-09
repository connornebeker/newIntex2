import { useEffect, useState } from 'react';
import { fetchRecommendedMovies } from '../api/MovieAPIs';
import { Movie } from '../types/Movie';
// import { useParams } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import fetchPoster from '../utils/fetchPoster';
import AuthorizeView from '../components/AuthorizeView';

function MoviesPage() {
  // const { show_id, title } = useParams<{ show_id: string, title: string  }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [curMovie, setCurMovie] = useState<Movie>();
  const [loadingRec, setLoadingRec] = useState(true);
  const [errorRec, setErrorRec] = useState(null);
  const [recMovies, setRecMovies] = useState<Movie[]>([]);
  const [userRating, setUserRating] = useState<number | 0>(0);
  const [showMainPoster, setShowMainPoster] = useState(true);
  const location = useLocation();
  const { movie } = location.state || {};
  // const passedTitle = location.state?.title;
  // const movieTitle = title || passedTitle;

  const genreMap: { [key: string]: string } = {
    action: 'Action',
    adventure: 'Adventure',
    animeSeriesInternationalTVShows: 'Anime TV Series',
    britishTVShowsDocuseriesInternationalTVShows:
      'British TV Show & International Docuseries',
    children: "Children's Movie",
    comedies: 'Comedy',
    comediesDramasInternationalMovies: 'International Comedy-Drama',
    comediesInternationalMovies: 'International Comedy Film',
    comediesRomanticMovies: 'Romantic Comedy',
    crimeTVShowsDocuseries: 'Crime TV Series',
    documentaries: 'Documentary',
    documentariesInternationalMovies: 'International Documentary',
    docuseries: 'Docuseries',
    dramas: 'Drama',
    dramasInternationalMovies: 'International Drama',
    dramasRomanticMovies: 'Romantic Drama',
    familyMovies: 'Family',
    fantasy: 'Fantasy',
    horrorMovies: 'Horror',
    internationalMoviesThrillers: 'International Thriller',
    internationalTVShowsRomanticTVShowsTVDramas:
      'International Romantic Dramas',
    kidsTV: "Children's TV",
    languageTVShows: 'Language TV Show',
    musicals: 'Musicals',
    natureTV: 'Nature Documentary',
    realityTV: 'Reality TV Show',
    spirituality: 'Spritual',
    tVAction: 'Action TV Show',
    tVComedies: 'Comedy TV Show',
    tVDramas: 'Drama TV Show',
    talkShowsTVComedies: 'Talk Show Comedy',
    thrillers: 'Thriller',
  };

  const getGenres = (movie: any): string[] => {
    return Object.keys(genreMap)
      .filter((key) => movie[key] === 1)
      .map((key) => genreMap[key]);
  };

  useEffect(() => {
    const loadMovie = async () => {
      setCurMovie(movie);
    };
    loadMovie();
  }, []);

  useEffect(() => {
    const loadRecMovies = async () => {
      try {
        if (!movie.title) return;
        setLoadingRec(true);
        const recs = await fetchRecommendedMovies(movie.title);
        setRecMovies(recs.movies);
      } catch (error: any) {
        setErrorRec(error);
        console.error('Error fetching movie:', error);
      } finally {
        setLoadingRec(false);
      }
    };
    loadRecMovies();
  }, [movie]);

  const handleRatingChange = (rating: number) => {
    setUserRating(rating);
  };

  const recMoviesWithPosters = recMovies.map((movie) => {
    const safeTitle = movie.title
      .normalize('NFD')
      .replace(/[:'()’!.&-]/g, '') // remove punctuation
      .trim();

    return {
      ...movie,
      posterUrl: fetchPoster(safeTitle),
    };
  });

  return (
    <AuthorizeView>
    <div>
      {loading}
      {error && <p>Error loading movie.</p>}
      {movie && (
        <>
          <div className="row">
            <Link to={`/home`}>
              <button>Home</button>
            </Link>
            <div className="col-3">
              {showMainPoster ? (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  height="300px"
                  onError={() => setShowMainPoster(false)}
                />
              ) : (
                <p></p>
              )}
            </div>
            <div className="col-9">
              <h1>{movie.title}</h1>
              <p>{movie.description}</p>
              <p>Director: {movie.director ?? 'Unknown'}</p>
              <p>Cast: {movie.cast ?? 'Unknown'}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <p>
                {movie.release_year} | {movie.duration ?? 'Unknown Duration'} |{' '}
                {movie.country ?? 'Country Unknown'}
              </p>
            </div>
            <div>
              <p>Rating: {movie.rating ?? 'Not Rated'}</p>
            </div>
            <div>
              <h2>Genres</h2>
              <p>{getGenres(movie).join(', ') || 'Unknown'}</p>
            </div>
          </div>
          <div>
            <div>
              <h3>Rate this movie:</h3>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <span
                    key={rating}
                    style={{
                      fontSize: '2.5rem',
                      cursor: 'pointer',
                      color: userRating >= rating ? 'gold' : 'gray',
                    }}
                    onClick={() => handleRatingChange(rating)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p>Your rating: {userRating ?? 'Not Rated'}</p>
              {/* <button onClick={() => handleRatingSubmit(userRating)}>
                Submit Rating
              </button> */}
            </div>
          </div>
        </>
      )}
      <div>
        <h2>Similar Movies:</h2>
        {loadingRec && <p>Loading...</p>}
        {errorRec && <p>Error loading recommended movies.</p>}
        {recMovies.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {recMoviesWithPosters.map((movie) => (
              <Link
                key={movie.show_id}
                to={`/movies/${movie.show_id}`}
                state={{ movie }}
                onClick={() => {
                  setCurMovie(movie);
                  setShowMainPoster(true);
                }}
              >
                <div>
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    height="150px"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null; // Prevent infinite loop
                      target.style.display = 'none';
                      const fallbackDiv = document.createElement('div');
                      fallbackDiv.textContent = movie.title;
                      fallbackDiv.style.height = '150px';
                      fallbackDiv.style.width = '100px';
                      fallbackDiv.style.display = 'flex';
                      fallbackDiv.style.alignItems = 'center';
                      fallbackDiv.style.justifyContent = 'center';
                      fallbackDiv.style.backgroundColor = '#ddd';
                      fallbackDiv.style.color = '#333';
                      fallbackDiv.style.fontWeight = 'bold';
                      fallbackDiv.style.border = '1px solid #ccc';
                      target.parentNode?.appendChild(fallbackDiv);
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>No recommended movies available.</p>
        )}
      </div>
    </div>
    </AuthorizeView>
  );
}

export default MoviesPage;
