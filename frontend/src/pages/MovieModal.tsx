// components/MovieModal.tsx
import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import fetchPoster from '../utils/fetchPoster';
import { fetchRecommendedMovies } from '../api/MovieAPIs';
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

  useEffect(() => {
    const loadRecMovies = async () => {
      if (!movie.title) return;
      const recs = await fetchRecommendedMovies(movie.title);
      setRecMovies(recs.movies || []);
    };
    loadRecMovies();
  }, [movie]);

  const genreMap: { [key: string]: string } = {
    action: 'Action',
    adventure: 'Adventure',
    animeSeriesInternationalTVShows: 'Anime TV Series',
    britishTVShowsDocuseriesInternationalTVShows: 'British TV Show & International Docuseries',
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
    internationalTVShowsRomanticTVShowsTVDramas: 'International Romantic Dramas',
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

  const handleRatingChange = (rating: number) => setUserRating(rating);

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
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-banner-wrapper">
          <img className="modal-banner" src={movie.posterUrl} alt={movie.title} />
          <div className="modal-banner-gradient" />
          <div className="modal-banner-overlay">
            <h2>{movie.title}</h2>
            <div className="meta">
              {movie.release_year} | {movie.duration || 'Unknown Duration'} | {movie.country || 'Unknown'} | {movie.rating || 'Unrated'}
            </div>
            <button className="modal-play">▶ Play</button>
          </div>
        </div>

        <div className="modal-main-info">
          <div className="modal-columns">
            <div className="modal-left">
              <p className="modal-description">{movie.description}</p>
            </div>
            <div className="modal-right">
              <div className="meta-row">
                <strong>Director:</strong> <span>{movie.director || 'Unknown'}</span>
              </div>
              <div className="meta-row">
                <strong>Cast:</strong> <span>{movie.cast || 'Unknown'}</span>
              </div>
              <div className="meta-row">
                <strong>Genres:</strong> <span>{getGenres(movie).join(', ') || 'Unknown'}</span>
              </div>
            </div>
          </div>

          <h4 style={{ marginTop: '1.5rem' }}>Rate this movie:</h4>
          <div style={{ marginBottom: '1rem' }}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <span
                key={rating}
                className={`star ${userRating >= rating ? 'active' : ''}`}
                onClick={() => handleRatingChange(rating)}
              >
                ★
              </span>
            ))}
          </div>

          <div className="modal-recommendations">
            <h3>More Like This</h3>
            <div className="recommendation-grid">
              {recMoviesWithPosters.map((rec) => (
                <div
                  key={rec.show_id}
                  className="recommendation-item"
                  onClick={() => onMovieSelect(rec)}
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
    </div>
  );
}
