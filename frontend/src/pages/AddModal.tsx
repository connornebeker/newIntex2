import { useState } from 'react';
import axios from 'axios';
import './FormModal.css';

const ratingOptions = [
  'G',
  'NR',
  'PG',
  'PG-13',
  'R',
  'TV-14',
  'TV-G',
  'TV-MA',
  'TV-PG',
  'TV-Y',
  'TV-Y7',
  'TV-Y7-FV',
  'UR',
];

const typeOptions = ['Movie', 'TV Show'];

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

export default function AddModal({ onClose }: AddModalProps) {
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
      show_id: `s10000`,
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

    if (
      !movieToSubmit.title ||
      !movieToSubmit.director ||
      !movieToSubmit.release_year
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      await axios.post(
        'https://intex-group2-7-backend-duahbmbxaggha8e2.eastus-01.azurewebsites.net/api/Movie/AddMovie',
        movieToSubmit,
        { withCredentials: true }
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
            <div className="form-left">
              <div>
                <label>Type:</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="">Select Type</option>
                  {typeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
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
                  {ratingOptions.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
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
