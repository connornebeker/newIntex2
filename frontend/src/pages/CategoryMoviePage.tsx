import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Movie } from '../types/Movie';
import TopAppBar from '../components/TopAppBar';
import '../pages/CategoryMoviePage.css';
import getMoviesOneGenre from '../utils/getMovieFromGenre';

export default function CategoryMoviePage() {
  const { categoryName } = useParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastMovieRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [categoryName]);

  useEffect(() => {
    async function fetchMovies() {
      if (!categoryName || !hasMore) return;

      setIsLoading(true);
      const newMovies = await getMoviesOneGenre(categoryName, page, 20);
      setMovies(prev => [...prev, ...newMovies]);
      setIsLoading(false);

      if (newMovies.length < 20) setHasMore(false); // No more data
    }

    fetchMovies();
  }, [categoryName, page]);

  // Optional: Your genre formatting helpers remain unchanged...

  return (
    <div>
      <TopAppBar />
      <h2>{categoryName}</h2>
      <div className="home-thing-1">
        <div className="home-slice-1">
          <div className="movie-grid">
            {movies.map((movie, index) => {
              const isLast = index === movies.length - 1;
              return (
                <div
                  key={movie.show_id}
                  className="movie-card"
                  ref={isLast ? lastMovieRef : null}
                >
                  <Link to={`/movies/${movie.show_id}`} state={{ movie }}>
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="movie-poster"
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
        {isLoading && <p style={{ textAlign: 'center' }}>Loading...</p>}
      </div>
    </div>
  );
}


// import { useEffect, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import { Movie } from '../types/Movie';
// import TopAppBar from '../components/TopAppBar';
// import '../pages/CategoryMoviePage.css';
// import getMoviesOneGenre from '../utils/getMovieFromGenre';

// export default function CategoryMoviePage() {
//   const { categoryName } = useParams();
//   const [movies, setMovies] = useState<Movie[]>([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true); // to prevent further fetches if no more data


//   // useEffect(() => {
//   //   async function fetchMovies() {
//   //     if (categoryName) {
//   //       const fetchedMovies = await getMoviesOneGenre(categoryName);
//   //       setMovies(fetchedMovies);
//   //     }
//   //   }

//   //   fetchMovies();
//   // }, [categoryName]); // Re-run when categoryName changes


// useEffect(() => {
//   async function fetchMovies() {
//     if (!categoryName || loading || !hasMore) return;
//     setLoading(true);

//     const newMovies = await getMoviesOneGenre(categoryName, 1, 20);
//     if (newMovies.length === 0) setHasMore(false);
//     setMovies((prev) => [...prev, ...newMovies]);
//     setLoading(false);
//   }

//   fetchMovies();
// }, [page, categoryName]);


// useEffect(() => {
//   function handleScroll() {
//     if (
//       window.innerHeight + document.documentElement.scrollTop >=
//         document.documentElement.offsetHeight - 200 &&
//       !loading &&
//       hasMore
//     ) {
//       setPage((prevPage) => prevPage + 1);
//     }
//   }

//   window.addEventListener('scroll', handleScroll);
//   return () => window.removeEventListener('scroll', handleScroll);
// }, [loading, hasMore]);


//   function changeGenreName(genre: string): string {
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
  
//   function formatGenreName(genre: string): string {
//     // Convert camelCase or PascalCase to spaced and capitalized words
//     return genre
//       .replace(/([a-z])([A-Z])/g, '$1 $2')
//       .replace(/^./, (char) => char.toUpperCase());
//   }


//   return (
//     <div>
//       <TopAppBar />
//       <h2>{formatGenreName(changeGenreName(categoryName || ''))}</h2>
//       <div className="home-thing-1">
//         <div className="home-slice-1">
//           <div className="movie-grid">
//             {movies.map((movie) => (
//               <div key={movie.show_id} className="movie-card">
//                 <Link to={`/movies/${movie.show_id}`} state={{ movie }}>
//                   <img
//                     src={movie.posterUrl}
//                     alt={movie.title}
//                     className="movie-poster"
//                   />
//                   {/* <h3 className="movie-title">{movie.title}</h3> */}
//                 </Link>
//               </div>
//             ))}
//           </div>
//           {loading && <p className="loading">Loading more movies...</p>}
//         </div>
//       </div>
//     </div>
//   );
// }


