import { useState } from 'react';
import axios from 'axios';
import { Movie } from '../types/Movie';
import './FormModal.css';

type EditModalProps = {
  onClose: () => void;
  movie: Movie;
};

type MovieFormData = {
  show_id: string;
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

export default function EditModal({ onClose, movie }: EditModalProps) {
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
    spirituality: 'Spiritual',
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

  const [formData, setFormData] = useState<MovieFormData>(() => ({
    show_id: movie.show_id,
    type: movie.type || '',
    title: movie.title || '',
    director: movie.director || '',
    cast: movie.cast || '',
    country: movie.country || '',
    releaseYear: movie.release_year?.toString() || '',
    rating: movie.rating || '',
    duration: movie.duration || '',
    description: movie.description || '',
    genres: getGenres(movie) || [],
  }));

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

    const genreKeys = Object.keys(genreMap);
    const genreBooleans = genreKeys.reduce(
      (acc, key) => {
        acc[key] = formData.genres.includes(genreMap[key]) ? 1 : 0;
        return acc;
      },
      {} as Record<string, number>
    );

    const movieToSubmit = {
      show_id: formData.show_id,
      type: formData.type,
      title: formData.title,
      director: formData.director,
      cast: formData.cast,
      country: formData.country,
      release_year: parseInt(formData.releaseYear),
      rating: formData.rating,
      duration: formData.duration,
      description: formData.description,
      ...genreBooleans,
    };

    try {
      await axios.put(
        'https://intex-group2-7-backend-duahbmbxaggha8e2.eastus-01.azurewebsites.net/api/Movie/EditMovie',
        movieToSubmit,
        { withCredentials: true }
      );
      alert('Movie updated!');
      onClose();
      // window.location.reload();
    } catch (err) {
      console.error('Error updating movie:', err);
      alert('Failed to update movie.');
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
            <h2>Edit {formData.title}</h2>
          </div>
        </div>
        <div className="modal-main-info">
          <form onSubmit={handleSubmit} className="movie-form">
            <input name="show_id" value={formData.show_id} hidden />

            <div className="form-left">
              <div>
                <label>Type:</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="">Select Type</option>
                  <option value="Movie">Movie</option>
                  <option value="TV Show">TV Show</option>
                </select>
              </div>

              <div>
                <label>Title:</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Director:</label>
                <input
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Country:</label>
                <input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Release Year:</label>
                <input
                  type="number"
                  name="releaseYear"
                  value={formData.releaseYear}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Rating:</label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                >
                  <option value="">Select Rating</option>
                  <option value="G">G</option>
                  <option value="NR">NR</option>
                  <option value="PG">PG</option>
                  <option value="PG-13">PG-13</option>
                  <option value="R">R</option>
                  <option value="TV-14">TV-14</option>
                  <option value="TV-G">TV-G</option>
                  <option value="TV-MA">TV-MA</option>
                  <option value="TV-PG">TV-PG</option>
                  <option value="TV-Y">TV-Y</option>
                  <option value="TV-Y7">TV-Y7</option>
                  <option value="TV-Y7-FV">TV-Y7-FV</option>
                  <option value="UR">UR</option>
                </select>
              </div>

              <div>
                <label>Duration:</label>
                <input
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-right">
              <div>
                <label>Cast:</label>
                <input
                  name="cast"
                  value={formData.cast}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
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
            </div>

            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
