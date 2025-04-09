import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Movie } from '../types/Movie';
import TopAppBar from '../components/TopAppBar';
import '../pages/CategoryMoviePage.css';
import getMoviesOneGenre from '../utils/getMovieFromGenre';

export default function CategoryMoviePage() {
  const { categoryName } = useParams();
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    async function fetchMovies() {
      if (categoryName) {
        const fetchedMovies = await getMoviesOneGenre(categoryName);
        setMovies(fetchedMovies);
      }
    }

    fetchMovies();
  }, [categoryName]); // Re-run when categoryName changes

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
    <div>
      <TopAppBar />
      <h2>{formatGenreName(changeGenreName(categoryName || ''))}</h2>
      <div className="home-thing-1">
        <div className="home-slice-1">
          <div className="movie-grid">
            {movies.map((movie) => (
              <div key={movie.show_id} className="movie-card">
                <Link to={`/movies/${movie.show_id}`} state={{ movie }}>
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="movie-poster"
                  />
                  {/* <h3 className="movie-title">{movie.title}</h3> */}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


// import { useEffect, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import { Movie } from '../types/Movie';
// import TopAppBar from '../components/TopAppBar';
// import CategoryCards from '../components/CategoryCards';
// import '../pages/CategoryMoviePage.css';
// import fetchPoster from '../utils/fetchPoster';
// import getMoviesOneGenre from '../utils/getMovieFromGenre';

// export default function CategoryMoviePage() {
//   const { categoryName } = useParams();
//   const [movies, setMovies] = useState<Movie[]>([]);

//   useEffect(() => {
//     async function fetchMovies() {
//       try {
//         const res = await fetch(
//           `https://localhost:5000/api/Movie/GetMoviesByGenre?genre=${encodeURIComponent(categoryName || '')}&page=1&pageSize=100`
//         );
//         if (!res.ok) {
//           console.warn(`Failed to fetch movies for genre: ${categoryName}`);
//           return; // Stop further execution if the fetch fails
//         }

//         const movies: Movie[] = await res.json();

//         const moviesWithPosters = movies.map((movie) => {
//           const safeTitle = movie.title
//             .normalize('NFD')
//             .replace(/[:'()’!.&-]/g, '') // Remove punctuation
//             .trim();

//           return {
//             ...movie,
//             posterUrl: fetchPoster(safeTitle),
//           };
//         });

//         setMovies(moviesWithPosters); // Set the fetched movies to the state
//       } catch (error) {
//         console.error('Error fetching movies:', error);
//       }
//     }

//     fetchMovies();
//   }, [categoryName]); // Re-run when categoryName changes

//   return (
//     <div>
//       <TopAppBar />
//       <CategoryCards />

//       <div className="home-container">
//         <div className="home-content">
//           <div className="movie-grid">
//             {movies.map((movie) => (
//               <div key={movie.show_id} className="movie-card">
//                 <Link to={`/movies/${movie.show_id}`} state={{ movie }}>
//                   <img
//                     src={movie.posterUrl}
//                     alt={movie.title}
//                     className="movie-poster"
//                   />
//                   <h3 className="movie-title">{movie.title}</h3>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import { useEffect, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import { Movie } from '../types/Movie';
// import TopAppBar from '../components/TopAppBar';
// import CategoryCards from '../components/CategoryCards';
// import '../pages/CategoryMoviePage.css';
// import fetchPoster from '../utils/fetchPoster';


// export default function CategoryMoviePage() {
//   const { categoryName } = useParams();
//   const [movies, setMovies] = useState<Movie[]>([]);

//   useEffect(() => {
//     async function fetchMovies() {
//       try {
//             const res = await fetch(
//               `https://localhost:5000/api/Movie/GetMoviesByGenre?genre=${encodeURIComponent(categoryName)}&page=1&pageSize=100`
//             );
      
//             if (!res.ok) {
//               console.warn(`Failed to fetch movies for genre: ${categoryName}`);
//               continue;
//             }
      
//             const movies: Movie[] = await res.json();
      
//             const moviesWithPosters = movies.map((movie) => {
//               const safeTitle = movie.title
//                 .normalize('NFD')
//                 .replace(/[:'()’!.&-]/g, '') // remove punctuation
//                 .trim();
      
//               return {
//                 ...movie,
//                 posterUrl: fetchPoster(safeTitle),
//               };
//             });
//     fetchMovies();
//   }, [categoryName]);

//   return (
//     <div>
//       <TopAppBar />
//       <CategoryCards />

//       <div className="home-container">
//         <div className="home-content">
//           <div className="movie-grid">
//             {movies.map((movie) => (
//               <div key={movie.show_id} className="movie-card">
//                 <Link to={`/movies/${movie.show_id}`} state={{ movie }}>
//                   <img
//                     src={movie.posterUrl}
//                     alt={movie.title}
//                     className="movie-poster"
//                   />
//                   <h3 className="movie-title">{movie.title}</h3>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import { useEffect, useRef, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Movie } from '../types/Movie';
// import TopAppBar from '../components/TopAppBar';
// import CategoryCards from '../components/CategoryCards';
// import { useParams } from 'react-router-dom';
// import fetchPoster from '../utils/fetchPoster';

// const featuredMovies = ['Troy', 'Joker', 'Train to Busan', 'Inception'];


// export default async function CategoryMoviePage() {
//     const { categoryName } = useParams();
//     try {
//         const res = await fetch(
//           `https://localhost:5000/api/Movie/GetMoviesByGenre?genre=${encodeURIComponent(categoryName || '')}&page=1&pageSize=100`
//         );

//     if (!res.ok) {
//       console.warn(`Failed to fetch movies for genre: ${genre}`);
//       return null;
//     }

//     const movies: Movie[] = await res.json();

//     const moviesWithPosters = movies.map((movie) => {
//       const safeTitle = movie.title
//         .normalize('NFD')
//         .replace(/[:'()’!.&-]/g, '') // remove punctuation
//         .trim();

//       return {
//         ...movie,
//         posterUrl: fetchPoster(safeTitle),
//       };
//     });

//     return {
//       title: formatGenreName(changeGenreName(categoryName   || '')),
//       movies: moviesWithPosters,
//       itemsPerSlide: 8,
//     };
//   } catch (error) {
//     console.error(`Error fetching movies for genre ${categoryName}:`, error);
//     return null;
//   }


// function changeGenreName(genre: string): string {
//     switch (genre.toLowerCase()) {
//       case 'comediesdramas':
//         return 'Comedy-Dramas';
//       case 'comediesromanticmovies':
//         return 'Romantic Comedies';
//       case 'crimetvshows':
//         return 'Crime TV Series';
//       case 'dramasromanticmovies':
//         return 'Romantic Dramas';
//       case 'romanticmovies':
//         return 'Romantic Movies';
//       case 'internationalmovies':
//         return 'International Films';
//       case "kids'tv":
//         return "Children's TV";
//       case 'animeseriesinternationaltvshows':
//         return 'Anime TV Series';
//       case 'realitytv':
//         return 'Reality TV Shows';
//       case 'internationaltvshows':
//         return 'International TV Series';
//       case 'naturetv':
//         return 'Nature Documentaries';
//       case 'tvaction':
//         return 'Action TV Shows';
//       case 'comediesinternationalmovies':
//         return 'International Comedy Films';
//       case 'comediesdramasinternationalmovies':
//         return 'International Comedy-Dramas';
//       case 'internationalmoviesthrillers':
//         return 'International Thrillers';
//       case 'languagetvshows':
//         return 'Language TV Shows';
//       case 'talkshowstvcomedies':
//         return 'Talk Show Comedies';
//       case 'britishtvshows docuseriesinternationaltvshows':
//         return 'British TV Shows & International Docuseries';
//       case 'talkshows':
//         return 'Talk Shows';
//       case 'internationaltvshowsromantictvshowstvdramas':
//         return 'International TV Shows (Romantic, TV Dramas)';
//       case 'crimetvshowsdocuseries':
//         return 'Crime Docuseries';
//       case 'documentariesinternationalmovies':
//         return 'International Documentaries';
//       case 'children':
//         return "Children's Movies";
//       default:
//         return genre; // if the genre doesn't match any condition, return it unchanged
//     }
//   }

//     function formatGenreName(genre: string): string {
//         return genre
//             .replace(/([a-z])([A-Z])/g, '$1 $2')
//             .replace(/^./, (char) => char.toUpperCase());
//     }

//   return (
//     <>
//     <TopAppBar />
//     <CategoryCards />
//     <div className="home-container">
//       <div className="home-content">
    
//         </div>
//       </div>
//     </>
//   );
// }