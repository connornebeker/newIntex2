import { Carousel } from '../types/Carousel';
import { Movie } from '../types/Movie';
import fetchPoster from './fetchPoster';

export default async function getCarouselsFromGenres(): Promise<Carousel[]> {
  const carousels: Carousel[] = [];

  const genresRes = await fetch(
    'https://intex-group2-7-backend-duahbmbxaggha8e2.eastus-01.azurewebsites.net/api/Movie/GetMovieTypes',
    {
      credentials: 'include',
    }
  );
  if (!genresRes.ok) {
    console.error('Failed to fetch movie genres');
    return [];
  }

  const genres: string[] = await genresRes.json();

  for (const genre of genres) {
    try {
      const res = await fetch(
        `https://intex-group2-7-backend-duahbmbxaggha8e2.eastus-01.azurewebsites.net/api/Movie/GetMoviesByGenre?genre=${encodeURIComponent(genre)}&page=1&pageSize=100`,
        {
          credentials: 'include',
        }
      );

      if (!res.ok) {
        console.warn(`Failed to fetch movies for genre: ${genre}`);
        continue;
      }

      const movies: Movie[] = await res.json();

      const moviesWithPosters = movies.map((movie) => {
        const safeTitle = movie.title
          .normalize('NFD')
          .replace(/[:'()’!.&-]/g, '') // remove punctuation
          .trim();

        return {
          ...movie,
          posterUrl: fetchPoster(safeTitle),
        };
      });

      carousels.push({
        title: formatGenreName(changeGenreName(genre)),
        movies: moviesWithPosters,
        itemsPerSlide: 8,
      });
    } catch (error) {
      console.error(`Error fetching movies for genre ${genre}:`, error);
    }
  }

  return carousels;
}

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
