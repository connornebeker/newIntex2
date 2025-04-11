import { useState } from 'react';
import axios from 'axios';
import { Movie } from '../types/Movie';
import './AdminModal.css';
import EditModal from './EditModal';

type MovieModalProps = {
  movie: Movie;
  onClose: () => void;
};

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // map out the genres
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

  // get genres to filter from
  const getGenres = (movie: any): string[] =>
    Object.keys(genreMap)
      .filter((key) => movie[key] === 1)
      .map((key) => genreMap[key]);

  // Function to handle the deletion of the movie
  const handleDeleteMovie = async (show_id: string) => {
    try {
      await axios.delete(
        `https://intex-group2-7-backend-duahbmbxaggha8e2.eastus-01.azurewebsites.net/api/Movie/${show_id}`,
        {
          withCredentials: true,
        }
      );
      console.log('Movie deleted successfully');
      onClose(); // Close the modal after deletion
      // window.location.reload(); Reloads the entire page
    } catch (err) {
      console.error('Failed to delete the movie. Please try again.');
    }
  };

  // Function to show the confirmation dialog
  const showDeleteDialog = () => {
    setDeleteDialogVisible(true);
  };

  // Function to hide the confirmation dialog
  const hideDeleteDialog = () => {
    setDeleteDialogVisible(false);
  };

  return (
    <div className="modal-overlay-3" onClick={onClose}>
      <div className="modal-content-3" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-3" onClick={onClose}>
          ✕
        </button>

        <div className="modal-banner-wrapper-3">
          <img
            className="modal-banner-3"
            src={movie.posterUrl}
            alt={movie.title}
            onError={(e) => {
              const fallbackUrl = `https://dummyimage.com/300x450/cccccc/000000&text=${encodeURIComponent(movie.title)}`;
              (e.target as HTMLImageElement).src = fallbackUrl;
            }}
          />
          <div className="modal-banner-gradient-3" />
          <div className=" modal-info-3">
            <h2>{movie.title}</h2>
            <div className="meta-3">
              {movie.release_year} | {movie.duration || 'Unknown Duration'} |{' '}
              {movie.country || 'Unknown Country'} | {movie.rating || 'Unrated'}
              <div className="modal-info-3">
                <div className="modal-left-3">
                  <p className="modal-description-3">{movie.description}</p>
                </div>
                <div className="modal-right-3">
                  <div className="meta-row-3">
                    <strong>Director:</strong>{' '}
                    <span>{movie.director || 'Unknown'}</span>
                  </div>
                  <div className="meta-row-3">
                    <strong>Cast:</strong>{' '}
                    <span>{movie.cast || 'Unknown'}</span>
                  </div>
                  <div className="meta-row-3">
                    <strong>Genres:</strong>
                    <span>{getGenres(movie).join(', ') || 'Unknown'}</span>
                  </div>

                  <div className="modal-buttons-3">
                    <button
                      onClick={() => setShowForm(true)}
                      className="edit-button-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={showDeleteDialog}
                      className="delete-button-3"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isDeleteDialogVisible && (
          <div className="delete-overlay-3" onClick={hideDeleteDialog}>
            <div
              className="delete-modal-3"
              onClick={(e) => e.stopPropagation()}
            >
              <p>Are you sure you want to delete this movie?</p>
              <div className="delete-buttons-3">
                <button onClick={() => handleDeleteMovie(movie.show_id)}>
                  Yes
                </button>
                <button onClick={hideDeleteDialog}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        {showForm && (
          <div className="form-modal-3">
            <EditModal onClose={() => setShowForm(false)} movie={movie} />
            <button onClick={() => setShowForm(false)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
