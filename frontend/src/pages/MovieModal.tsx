// components/MovieModal.tsx
import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import fetchPoster from '../utils/fetchPoster';
import {
  fetchRecommendedMovies,
  fetchUserRating,
  sendMovieRating,
  updateMovieRating,
} from '../api/MovieAPIs';
import './MovieModal.css';

type MovieModalProps = {
  movie: Movie;
  onClose: () => void;
  onMovieSelect: (movie: Movie) => void;
};

export default function MovieModal({
  movie,
  onClose,
  onMovieSelect,
}: MovieModalProps) {
  const [recMovies, setRecMovies] = useState<Movie[]>([]);
  const [userRating, setUserRating] = useState<number | 0>(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [hasRatedBefore, setHasRatedBefore] = useState(false);

  useEffect(() => {
    const loadRecMovies = async () => {
      if (!movie.title) return;
      const recs = await fetchRecommendedMovies(movie.title);
      setRecMovies(recs.movies || []);
    };

    const loadUserRating = async () => {
      try {
        const rating = await fetchUserRating(movie.show_id);
        if (rating) {
          setUserRating(rating);
          setRatingSubmitted(true); // Because they’ve rated it before
        } else {
          setUserRating(0);
          setRatingSubmitted(false);
        }
      } catch (err) {
        console.error('Could not load user rating:', err);
      }
    };

    loadRecMovies();
    loadUserRating();
  }, [movie]);

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

  const getGenres = (movie: any): string[] =>
    Object.keys(genreMap)
      .filter((key) => movie[key] === 1)
      .map((key) => genreMap[key]);

  const handleRatingChange = async (rating: number) => {
    setUserRating(rating);

    try {
      if (hasRatedBefore) {
        await updateMovieRating(movie.show_id, rating);
      } else {
        await sendMovieRating(movie.show_id, rating);
      }
      console.log('Rating submitted!');
      setRatingSubmitted(true);
    } catch (err) {
      console.error('Failed to submit rating:', err);
    }
  };

  const recMoviesWithPosters = recMovies.map((m) => ({
    ...m,
    posterUrl: fetchPoster(
      m.title
        .normalize('NFD')
        .replace(/[:'()’!.&-]/g, '')
        .trim()
    ),
  }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

          <div className="modal-banner-wrapper-horizontal">
            <img
              className="modal-banner-horizontal"
              src={movie.posterUrl}
              alt={movie.title}
            />

            <div className="modal-info-horizontal">
              <h2>{movie.title}</h2>

              <div className="meta">
                {movie.release_year} | {movie.duration || 'Unknown Duration'} |{' '}
                {movie.country || 'Unknown Country'} | {movie.rating || 'Unrated'}
              </div>

              <button className="modal-play">▶ Play</button>

              <p className="modal-description">{movie.description}</p>

              {/* Move all this info here */}
              <div className="meta-row">
                <strong>Director:</strong> {movie.director || 'Unknown'}
              </div>

              <div className="meta-row">
                <strong>Cast:</strong> {movie.cast || 'Unknown'}
              </div>

              <div className="meta-row">
                <strong>Genres:</strong> {getGenres(movie).join(', ') || 'Unknown'}
              </div>
            </div>
          </div>


          {ratingSubmitted ? (
            <div className="rating-submitted">
              <h4>Thank you for rating this movie!</h4>
              <p>
                Your rating: {userRating} <span className="star active">★</span>
                {userRating > 1 ? 's' : ''}
              </p>
              <button
                onClick={() => {
                  {
                    setRatingSubmitted(false);
                  }
                  setHasRatedBefore(true);
                }}
              >
                Change Rating
              </button>
            </div>
          ) : (
            <div>
              <div className="rating-message">
                Rate this movie to help us improve your recommendations!
              </div>
              <h4 style={{ marginTop: '1.5rem' }}>Rate this movie:</h4>
              <div
                className="star-rating-container"
                style={{ marginBottom: '1rem' }}
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <span
                    key={rating}
                    className={`star ${userRating >= rating ? 'active' : ''}`}
                    onClick={() => setUserRating(rating)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div>
                <button
                  className="submit-rating"
                  onClick={() => handleRatingChange(userRating)}
                >
                  Submit Rating
                </button>
              </div>
            </div>
          )}
          <div className="modal-recommendations">
            <h3>More Like This</h3>
            <div className="recommendation-grid">
              {recMoviesWithPosters.map((rec) => (
                <div
                  key={rec.show_id}
                  className="recommendation-item-2"
                  onClick={() => {
                    onMovieSelect(rec);
                    setRatingSubmitted(false);
                    setUserRating(0);
                  }}
                >
                  <img
                    src={rec.posterUrl}
                    alt={rec.title}
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
   
  );
}
