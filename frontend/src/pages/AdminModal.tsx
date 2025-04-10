import { useState } from 'react';
import axios from 'axios';
import { Movie } from '../types/Movie';
import './MovieModal.css';
import './DeleteDialog.css';
import { useNavigate } from 'react-router-dom';
import EditModal from './EditModal';

type MovieModalProps = {
  movie: Movie;
  onClose: () => void;
};

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const navigate = useNavigate();
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

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

  // const handleEdit = (movie: Movie) => {
  //   setSelectedMovie(movie);
  //   setIsEditing(true);
  // };

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
      window.location.reload(); // Reloads the entire page
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-banner-wrapper">
          <img
            className="modal-banner"
            src={movie.posterUrl}
            alt={movie.title}
            onError={(e) => {
              const fallbackUrl = `https://dummyimage.com/300x450/cccccc/000000&text=${encodeURIComponent(movie.title)}`;
              (e.target as HTMLImageElement).src = fallbackUrl;
            }}
          />
          <div className="modal-banner-gradient" />
          <div className="modal-banner-overlay">
            <h2>{movie.title}</h2>
            <div className="meta">
              {movie.release_year} | {movie.duration || 'Unknown Duration'} |{' '}
              {movie.country || 'Unknown Country'} | {movie.rating || 'Unrated'}
            </div>
          </div>
        </div>

        <div className="modal-main-info">
          <div className="modal-columns">
            <div className="modal-left">
              <p className="modal-description">{movie.description}</p>
            </div>
            <div className="modal-right">
              <div className="meta-row">
                <strong>Director:</strong>{' '}
                <span>{movie.director || 'Unknown'}</span>
              </div>
              <div className="meta-row">
                <strong>Cast:</strong> <span>{movie.cast || 'Unknown'}</span>
              </div>
              <div className="meta-row">
                <strong>Genres:</strong>
                <span>{getGenres(movie).join(', ') || 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <button onClick={() => setShowForm(true)} className="add-button">
            Edit
          </button>
          <button onClick={showDeleteDialog}>Delete</button>
        </div>

        {/* Confirmation Dialog for Delete */}
        {isDeleteDialogVisible && (
          <div className="delete-dialog">
            <div className="delete-dialog-content">
              <p>Are you sure you want to delete this movie?</p>
              <div>
                <button onClick={() => handleDeleteMovie(movie.show_id)}>
                  Yes
                </button>
                <button onClick={hideDeleteDialog}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        {showForm && (
          <div className="form-modal">
            <EditModal onClose={() => setShowForm(false)} movie={movie} />
            <button onClick={() => setShowForm(false)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

// // components/MovieModal.tsx
// // import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Movie } from '../types/Movie';
// // import fetchPoster from '../utils/fetchPoster';
// // import {
// //   fetchRecommendedMovies,
// // //   fetchUserRating,
// // //   sendMovieRating,
// // //   updateMovieRating,
// // } from '../api/MovieAPIs';
// import './MovieModal.css';
// import { useNavigate } from 'react-router-dom';

// type MovieModalProps = {
//   movie: Movie;
//   onClose: () => void;
//   onMovieSelect: (movie: Movie) => void;
// };

// export default function MovieModal({
//   movie,
//   onClose,
// //   onMovieSelect,
// }: MovieModalProps) {
// //   const [recMovies, setRecMovies] = useState<Movie[]>([]);
// //   const [userRating, setUserRating] = useState<number | 0>(0);
// //   const [ratingSubmitted, setRatingSubmitted] = useState(false);
// //   const [hasRatedBefore, setHasRatedBefore] = useState(false);

// //   useEffect(() => {
// //     const loadRecMovies = async () => {
// //       if (!movie.title) return;
// //       const recs = await fetchRecommendedMovies(movie.title);
// //     //   setRecMovies(recs.movies || []);
// //     };

// //     // const loadUserRating = async () => {
// //     //   try {
// //     //     const rating = await fetchUserRating(movie.show_id);
// //     //     if (rating) {
// //     //       setUserRating(rating);
// //     //        setRatingSubmitted(true); // Because they’ve rated it before
// //     //     } else {
// //     //        setUserRating(0);
// //     //         setRatingSubmitted(false);
// //     //     }
// //     //   } catch (err) {
// //     //     console.error('Could not load user rating:', err);
// //     //   }
// //     // };

// //     loadRecMovies();
// //     // loadUserRating();
// //   }, [movie]);
//   const navigate = useNavigate();
//   const genreMap: { [key: string]: string } = {
//     action: 'Action',
//     adventure: 'Adventure',
//     animeSeriesInternationalTVShows: 'Anime TV Series',
//     britishTVShowsDocuseriesInternationalTVShows:
//       'British TV Show & International Docuseries',
//     children: "Children's Movie",
//     comedies: 'Comedy',
//     comediesDramasInternationalMovies: 'International Comedy-Drama',
//     comediesInternationalMovies: 'International Comedy Film',
//     comediesRomanticMovies: 'Romantic Comedy',
//     crimeTVShowsDocuseries: 'Crime TV Series',
//     documentaries: 'Documentary',
//     documentariesInternationalMovies: 'International Documentary',
//     docuseries: 'Docuseries',
//     dramas: 'Drama',
//     dramasInternationalMovies: 'International Drama',
//     dramasRomanticMovies: 'Romantic Drama',
//     familyMovies: 'Family',
//     fantasy: 'Fantasy',
//     horrorMovies: 'Horror',
//     internationalMoviesThrillers: 'International Thriller',
//     internationalTVShowsRomanticTVShowsTVDramas:
//       'International Romantic Dramas',
//     kidsTV: "Children's TV",
//     languageTVShows: 'Language TV Show',
//     musicals: 'Musicals',
//     natureTV: 'Nature Documentary',
//     realityTV: 'Reality TV Show',
//     spirituality: 'Spritual',
//     tVAction: 'Action TV Show',
//     tVComedies: 'Comedy TV Show',
//     tVDramas: 'Drama TV Show',
//     talkShowsTVComedies: 'Talk Show Comedy',
//     thrillers: 'Thriller',
//   };

//   const getGenres = (movie: any): string[] =>
//     Object.keys(genreMap)
//       .filter((key) => movie[key] === 1)
//       .map((key) => genreMap[key]);

//     const handleDeleteGoal = async (show_id: string) => {
//     try {
//         // Call your API to delete the goal
//         await axios.delete(`http://localhost:5000/api/Movie/${show_id}`);

//         // Update the local state by removing the deleted goal
//         // setGoals(goals.filter((goal) => goal.goal_id !== goalId));
//     } catch (err) {
//         console.error('Failed to delete the movie. Please try again.');
//     }
//     };
// //   const handleRatingChange = async (rating: number) => {
// //     setUserRating(rating);

// //     try {
// //       if (hasRatedBefore) {
// //         await updateMovieRating(movie.show_id, rating);
// //       } else {
// //         await sendMovieRating(movie.show_id, rating);
// //       }
// //       console.log('Rating submitted!');
// //       setRatingSubmitted(true);
// //     } catch (err) {
// //       console.error('Failed to submit rating:', err);
// //     }
// //   };

// //   const recMoviesWithPosters = recMovies.map((m) => ({
// //     ...m,
// //     posterUrl: fetchPoster(
// //       m.title
// //         .normalize('NFD')
// //         .replace(/[:'()’!.&-]/g, '')
// //         .trim()
// //     ),
// //   }));

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <button className="modal-close" onClick={onClose}>
//           ✕
//         </button>

//         <div className="modal-banner-wrapper">
//           <img
//             className="modal-banner"
//             src={movie.posterUrl}
//             alt={movie.title}
//           />
//           <div className="modal-banner-gradient" />
//           <div className="modal-banner-overlay">
//             <h2>{movie.title}</h2>
//             <div className="meta">
//               {movie.release_year} | {movie.duration || 'Unknown Duration'} |{' '}
//               {movie.country || 'Unknown Country'} | {movie.rating || 'Unrated'}
//             </div>
//             {/* <button className="modal-play">▶ Play</button> */}
//           </div>
//         </div>

//         <div className="modal-main-info">
//           <div className="modal-columns">
//             <div className="modal-left">
//               <p className="modal-description">{movie.description}</p>
//             </div>
//             <div className="modal-right">
//               <div className="meta-row">
//                 <strong>Director:</strong>{' '}
//                 <span>{movie.director || 'Unknown'}</span>
//               </div>
//               <div className="meta-row">
//                 <strong>Cast:</strong> <span>{movie.cast || 'Unknown'}</span>
//               </div>
//               <div className="meta-row">
//                 <strong>Genres:</strong>{' '}
//                 <span>{getGenres(movie).join(', ') || 'Unknown'}</span>
//               </div>
//             </div>
//           </div>
// {/*
//           {ratingSubmitted ? (
//             <div className="rating-submitted">
//               <h4>Thank you for rating this movie!</h4>
//               <p>
//                 Your rating: {userRating} <span className="star active">★</span>
//                 {userRating > 1 ? 's' : ''}
//               </p>
//               <button
//                 onClick={() => {
//                   {
//                     setRatingSubmitted(false);
//                   }
//                   setHasRatedBefore(true);
//                 }}
//               >
//                 Change Rating
//               </button>
//             </div>
//           ) : (
//             <div>
//               <div className="rating-message">
//                 Rate this movie to help us improve your recommendations!
//               </div>
//               <h4 style={{ marginTop: '1.5rem' }}>Rate this movie:</h4>
//               <div
//                 className="star-rating-container"
//                 style={{ marginBottom: '1rem' }}
//               >
//                 {[1, 2, 3, 4, 5].map((rating) => (
//                   <span
//                     key={rating}
//                     className={`star ${userRating >= rating ? 'active' : ''}`}
//                     onClick={() => setUserRating(rating)}
//                   >
//                     ★
//                   </span>
//                 ))}
//               </div>
//               <div>
//                 <button
//                   className="submit-rating"
//                   onClick={() => handleRatingChange(userRating)}
//                 >
//                   Submit Rating
//                 </button>
//               </div>
//             </div>
//           )} */}
//           {/* <div className="modal-recommendations">
//             <h3>More Like This</h3>
//             <div className="recommendation-grid">
//               {recMoviesWithPosters.map((rec) => (
//                 <div
//                   key={rec.show_id}
//                   className="recommendation-item"
//                   onClick={() => {
//                     onMovieSelect(rec);
//                     setRatingSubmitted(false);
//                     setUserRating(0);
//                   }}
//                 >
//                   <img
//                     src={rec.posterUrl}
//                     alt={rec.title}
//                     onError={(e) => {
//                       const target = e.currentTarget;
//                       target.onerror = null;
//                       target.style.display = 'none';
//                     }}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div> */}
//         </div>
//         <div>
//             <button
//                 onClick={() => navigate(`/editMovie/${movie.show_id}`)}
//             >
//                 Edit
//             </button>
//             <button
//                 onClick={() => handleDeleteGoal(movie.show_id)}
//             >
//                 Delete
//             </button>
//         </div>
//       </div>
//     </div>
//   );
// }
