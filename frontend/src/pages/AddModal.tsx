import { useState } from 'react';
import axios from 'axios';
import './MovieModal.css';
import './DeleteDialog.css';

//
type AddModalProps = {
  onClose: () => void;
};

type MovieFormData = {
  type: string;
  title: string;
  director: string;
  cast: string;
  country: string;
  releaseYear: string;
  rating: string;
  duration: string;
  description: string;
  genres: string[];
};

export default function AddModal({onClose }: AddModalProps) {

  // map out the genres
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

  // sets up the formData object to store input values
  const [formData, setFormData] = useState<MovieFormData>({
    type: '',
    title: '',
    director: '',
    cast: '',
    country: '',
    releaseYear: '',
    rating: '',
    duration: '',
    description: '',
    genres: [],
  });

  // when inputs change, update the formData object
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // when checkboxes change, update the formData object
  const handleCheckboxChange = (genre: string) => {
    setFormData((prev) => {
      const genres = prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre];
      return { ...prev, genres };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Map genre names to keys used in your backend
    const genreKeys = Object.keys(genreMap);

    // Build the genre object: { action: 1, comedies: 0, ... }
    const genreBooleans = genreKeys.reduce(
      (acc, key) => {
        acc[key] = formData.genres.includes(genreMap[key]) ? 1 : 0; // Ensure 0 or 1
        return acc;
      },
      {} as Record<string, number>
    );

    // Construct the full Movie object
    const movieToSubmit = {
      type: formData.type,
      title: formData.title,
      director: formData.director,
      cast: formData.cast,
      country: formData.country,
      release_year: parseInt(formData.releaseYear), // Ensure this is an integer
      rating: formData.rating,
      duration: formData.duration,
      description: formData.description,
      ...genreBooleans, // spread genre flags into the object
    };

    // Validate input fields (optional but useful for preventing empty values)
    if (
      !movieToSubmit.title ||
      !movieToSubmit.director ||
      !movieToSubmit.release_year
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    const movieToSubmitWithId = {
      ...movieToSubmit,
      show_id: `s10000`, // fake show_id that will be taken care of in the backend
    };

    // pass the movie to submit to the api
    try {
      await axios.post(
        'https://intex-group2-7-backend-duahbmbxaggha8e2.eastus-01.azurewebsites.net/api/Movie/AddMovie',
        movieToSubmitWithId,
        {
          withCredentials: true,
        }
      );
      alert('Movie added!');
      onClose();
    } catch (err) {
      console.error('Error adding movie:', err);
      alert('Failed to add movie.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-banner-wrapper">
          <div className="modal-banner-gradient" />
            <div className="modal-banner-overlay">
              <h2>Add to the Collection</h2>
            </div>
          </div>

          <div className="modal-main-info">
            <form onSubmit={handleSubmit} className="movie-form">
              <div>
                <label>Type:</label>
                <input name="type" value={formData.type} onChange={handleChange} />
              </div>
              <div>
                <label>Title:</label>
                <input name="title" value={formData.title} onChange={handleChange} />
              </div>
              <div>
                <label>Director:</label>
                <input name="director" value={formData.director} onChange={handleChange} />
              </div>
              <div>
                <label>Cast:</label>
                <input name="cast" value={formData.cast} onChange={handleChange} />
              </div>
              <div>
                <label>Country:</label>
                <input name="country" value={formData.country} onChange={handleChange} />
              </div>
              <div>
                <label>Release Year:</label>
                <input type = 'number' name="releaseYear" value={formData.releaseYear} onChange={handleChange} />
              </div>
              <div>
                <label>Rating:</label>
                <input name="rating" value={formData.rating} onChange={handleChange} />
              </div>
              <div>
                <label>Duration:</label>
                <input name="duration" value={formData.duration} onChange={handleChange} />
              </div>
              <div>
                <label>Description:</label>
                <textarea name="description" value={formData.description} onChange={handleChange} />
              </div>
              <div>
                <h4>Genres</h4>
                <div className="checkbox-group">
                  {Object.entries(genreMap).map(([key, label]) => (
                      <label key={key}>
                          <input
                          type="checkbox"
                          checked={formData.genres.includes(label)}
                          onChange={() => handleCheckboxChange(label)}
                          />
                          {label}
                      </label>
                      ))}
                </div>
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
      </div>
    </div>
  );
}
