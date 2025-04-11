import { useState } from 'react';
import axios from 'axios';
import { Movie } from '../types/Movie';
import './MovieModal.css';
import './DeleteDialog.css';

type EditModalProps = {
  onClose: () => void;
  movie: Movie;
};

type MovieFormData = {
  show_id: string; // Added show_id property
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

    // get genres to select
    const getGenres = (movie: any): string[] =>
        Object.keys(genreMap)
        .filter((key) => movie[key] === 1)
        .map((key) => genreMap[key]);

    // sets up form data to be used in the modal
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

    // when there are input changes, update the formData state
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // when checkboxes change, update the formData state with new genres
    const handleCheckboxChange = (genre: string) => {
        setFormData((prev) => {
        const genres = prev.genres.includes(genre)
            ? prev.genres.filter((g) => g !== genre)
            : [...prev.genres, genre];
        return { ...prev, genres };
        });
    };

    // when  
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

        // compiles info to be sent to api
        const movieToSubmit = {
            show_id: formData.show_id, // Make sure this is set before editing
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
            window.location.reload();
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
            <div>
              <input name="show_id" value={formData.show_id} hidden />
              <label>Type:</label>
              <input
                name="type"
                value={formData.type}
                onChange={handleChange}
              />
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
              <label>Cast:</label>
              <input
                name="cast"
                value={formData.cast}
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
              <input
                name="rating"
                value={formData.rating}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Duration:</label>
              <input
                name="duration"
                value={formData.duration}
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
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
