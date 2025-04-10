import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Category.css';

export default function CategoryPage() {
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    async function fetchGenres() {
      const response = await fetch(
        'https://intex-group2-7-backend-duahbmbxaggha8e2.eastus-01.azurewebsites.net/api/Movie/GetMovieTypes',
        {
          credentials: 'include',
        }
      );
      const data = await response.json();
      setGenres(data); // assuming it's an array of strings
    }
    fetchGenres();
  }, []);

  function changeGenreName(genre: string): string {
    switch (genre.toLowerCase()) {
      case 'comediesdramas':
        return 'Comedy-Dramas';
      case 'comediesromanticmovies':
        return 'Romantic Comedies';
      case 'crimetvshows':
        return 'Crime TV Series';
      case 'dramasromanticmovies':
        return 'Romantic Dramas';
      case 'romanticmovies':
        return 'Romantic Movies';
      case 'internationalmovies':
        return 'International Films';
      case "kids'tv":
        return "Children's TV";
      case 'animeseriesinternationaltvshows':
        return 'Anime TV Series';
      case 'realitytv':
        return 'Reality TV Shows';
      case 'internationaltvshows':
        return 'International TV Series';
      case 'naturetv':
        return 'Nature Documentaries';
      case 'tvaction':
        return 'Action TV Shows';
      case 'comediesinternationalmovies':
        return 'International Comedy Films';
      case 'comediesdramasinternationalmovies':
        return 'International Comedy-Dramas';
      case 'internationalmoviesthrillers':
        return 'International Thrillers';
      case 'languagetvshows':
        return 'Language TV Shows';
      case 'talkshowstvcomedies':
        return 'Talk Show Comedies';
      case 'britishtvshows docuseriesinternationaltvshows':
        return 'British TV Shows & International Docuseries';
      case 'talkshows':
        return 'Talk Shows';
      case 'internationaltvshowsromantictvshowstvdramas':
        return 'International TV Shows (Romantic, TV Dramas)';
      case 'crimetvshowsdocuseries':
        return 'Crime Docuseries';
      case 'documentariesinternationalmovies':
        return 'International Documentaries';
      case 'children':
        return "Children's Movies";
      default:
        return genre; // if the genre doesn't match any condition, return it unchanged
    }
  }

  function formatGenreName(genre: string): string {
    // Convert camelCase or PascalCase to spaced and capitalized words
    return genre
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, (char) => char.toUpperCase());
  }

  return (
    <>
      <div>
        <h2>Explore</h2>
        <div className="category-row">
          {genres.map((genre) => (
            <div key={genre} className="category-box">
              <Link to={`/category/${genre}`}>
                {formatGenreName(changeGenreName(genre))}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
