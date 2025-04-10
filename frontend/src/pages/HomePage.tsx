import { useEffect, useRef, useState } from 'react';
import { Carousel } from '../types/Carousel';
import getCarouselsFromGenres from '../utils/getCarouselsFromGenres';
import { Movie } from '../types/Movie';
import {
  fetchBecauseYouWatchedMovies,
  fetchUserRecommendedMovies,
} from '../api/MovieAPIs';
import fetchPoster from '../utils/fetchPoster';
import AuthorizeView from '../components/AuthorizeView';
import TopAppBar from '../components/TopAppBar';
import CookieConsent from 'react-cookie-consent';
import MovieModal from './MovieModal';

export default function HomePage() {
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [loadedCarousels, setLoadedCarousels] = useState(5); // Track the number of carousels loaded
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const carouselRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const loadMoreRef = useRef<HTMLDivElement | null>(null); // Ref to the div at the bottom

  // Fetch carousels on load
  useEffect(() => {
    async function loadData() {
      const baseCarousels = await getCarouselsFromGenres();
      const updatedCarousels = [...baseCarousels];

      const username = localStorage.getItem('username');

      if (username) {
        try {
          const userRecs: Movie[] = await fetchUserRecommendedMovies();
          const formattedUserRecs = userRecs.map((movie) => ({
            ...movie,
            posterUrl: fetchPoster(
              movie.title
                .normalize('NFD')
                .replace(/[:'()'!.&-]/g, '')
                .trim()
            ),
          }));
          updatedCarousels.unshift({
            title: 'Recommended For You',
            movies: formattedUserRecs,
            itemsPerSlide: 8,
            showNumbers: false,
          });

          const { baseMovie, recommended } =
            await fetchBecauseYouWatchedMovies();
          const formattedWatchedRecs = recommended.map((movie) => ({
            ...movie,
            posterUrl: fetchPoster(
              movie.title
                .normalize('NFD')
                .replace(/[:'()'!.&-]/g, '')
                .trim()
            ),
          }));
          updatedCarousels.unshift({
            title: `Because You Watched ${baseMovie.liked}`,
            movies: formattedWatchedRecs,
            itemsPerSlide: 8,
            showNumbers: false,
          });
        } catch (err) {
          console.error('Error loading personalized carousels:', err);
        }
      } else {
        console.info(
          'No username in localStorage — skipping personalized carousels.'
        );
      }

      setCarousels(updatedCarousels);
    }

    loadData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // When the bottom div is in view, load more carousels
          setLoadedCarousels((prev) => Math.min(prev + 5, carousels.length)); // Ensure it doesn't exceed available carousels
        }
      },
      {
        rootMargin: '100px', // Trigger observer a bit before reaching the bottom
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [carousels.length]); // Depend on carousels.length to update observer when data changes

  const handlePosterError = (carouselTitle: string, movieId: string) => {
    setCarousels((prevCarousels) =>
      prevCarousels.map((carousel) =>
        carousel.title === carouselTitle
          ? {
              ...carousel,
              movies: carousel.movies.filter(
                (movie) => movie.show_id !== movieId
              ),
            }
          : carousel
      )
    );
  };

  const scroll = (
    carouselTitle: string,
    direction: 'left' | 'right',
    itemsPerSlide: number
  ) => {
    const container = carouselRefs.current[carouselTitle];
    if (!container) return;
    const card = container.querySelector('div');
    if (!card) return;
    const cardWidth = (card as HTMLElement).offsetWidth + 24;
    const scrollAmount = cardWidth * itemsPerSlide;
    if (direction === 'left') {
      if (container.scrollLeft <= 0) {
        container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    } else {
      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 10
      ) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <AuthorizeView>
      <div className="home-container">
        <div className="home-content">
          <TopAppBar />

          {/* 🎥 Hero Video Section */}
          <div className="hero-video-container">
            <video autoPlay loop muted playsInline className="hero-video">
              <source src="/movietrailer.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="hero-overlay">
              <h1 className="hero-title">MANIFEST</h1>
              <button className="hero-button-5">Play</button>
            </div>
          </div>

          {/* CATEGORIES */}
          <div className="category-row">
            {['Action', 'Horror', 'Comedy', 'Romance', 'Adventure'].map(
              (category) => (
                <div key={category} className="category-box">
                  {category}
                </div>
              )
            )}
          </div>

          {/* TOP 5 */}
          <h2 className="top10title">Top 5 in the U.S. Today</h2>
          <div className="top10-row">
            {[...Array(5)].map((_, index) => (
              <div className="top10-item" key={index}>
                <span className="rank-number">{index + 1}</span>
                <img
                  src={`./top10/movie${index + 1}.jpg`}
                  alt={`Top ${index + 1}`}
                  className="top10-poster"
                />
              </div>
            ))}
          </div>
          {/* Carousels */}
          {carousels.slice(0, loadedCarousels).map((carousel) => (
            <section key={carousel.title} className="carousel-section">
              <div className="carousel-title-bar">
                <h2 className="section-title">{carousel.title}</h2>
              </div>
              <div className="carousel-hover-group">
                <button
                  className="scroll-button left"
                  onClick={() =>
                    scroll(carousel.title, 'left', carousel.itemsPerSlide)
                  }
                />
                <div
                  className={`horizontal-carousel ${
                    carousel.showNumbers
                      ? 'horizontal-carousel-top'
                      : 'horizontal-carousel-normal'
                  }`}
                  ref={(el: HTMLDivElement | null) => {
                    if (el) carouselRefs.current[carousel.title] = el;
                  }}
                >
                  {carousel.movies.map((movie, index) => (
                    <div
                      key={movie.show_id}
                      className={
                        carousel.showNumbers
                          ? 'top-movie-item'
                          : 'recommendation-item'
                      }
                    >
                      {carousel.showNumbers && (
                        <div className="top-movie-number">{index + 1}</div>
                      )}
                      {movie.posterUrl && (
                        <div
                          onClick={() => setSelectedMovie(movie)}
                          style={{ cursor: 'pointer' }}
                        >
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            onError={() =>
                              handlePosterError(carousel.title, movie.show_id)
                            }
                            className={
                              carousel.showNumbers
                                ? 'top-movie-poster'
                                : 'recommendation-image'
                            }
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  className="scroll-button right"
                  onClick={() =>
                    scroll(carousel.title, 'right', carousel.itemsPerSlide)
                  }
                />
              </div>
            </section>
          ))}

          {/* This div will trigger the intersection observer */}
          <div ref={loadMoreRef} style={{ height: '1px' }}></div>
        </div>
        <CookieConsent>
          This website uses cookies to enhance the user experience.
        </CookieConsent>

        {selectedMovie && (
          <MovieModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            onMovieSelect={(newMovie) => setSelectedMovie(newMovie)}
          />
        )}
      </div>
    </AuthorizeView>
  );
}

// import { useEffect, useRef, useState } from 'react';
// import { Link } from 'react-router-dom';
// import './HomePage.css';
// import CookieConsent from 'react-cookie-consent';
// import { Carousel } from '../types/Carousel';
// import getCarouselsFromGenres from '../utils/getCarouselsFromGenres';
// import TopAppBar from '../components/TopAppBar';
// import MovieModal from './MovieModal';
// import { Movie } from '../types/Movie';
// import {
//   fetchBecauseYouWatchedMovies,
//   fetchUserRecommendedMovies,
// } from '../api/MovieAPIs';
// import fetchPoster from '../utils/fetchPoster';
// import AuthorizeView from '../components/AuthorizeView';

// export default function HomePage() {
//   const [carousels, setCarousels] = useState<Carousel[]>([]);
//   const [loadedCarousels, setLoadedCarousels] = useState(5); // Track the number of carousels loaded
//   const carouselRefs = useRef<Record<string, HTMLDivElement | null>>({});
//   const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

//   // Fetch carousels on load
//   useEffect(() => {
//     async function loadData() {
//       const baseCarousels = await getCarouselsFromGenres();
//       const updatedCarousels = [...baseCarousels];

//       const username = localStorage.getItem('username');

//       if (username) {
//         try {
//           const userRecs: Movie[] = await fetchUserRecommendedMovies();
//           const formattedUserRecs = userRecs.map((movie) => ({
//             ...movie,
//             posterUrl: fetchPoster(
//               movie.title
//                 .normalize('NFD')
//                 .replace(/[:'()'!.&-]/g, '')
//                 .trim()
//             ),
//           }));
//           updatedCarousels.unshift({
//             title: 'Recommended For You',
//             movies: formattedUserRecs,
//             itemsPerSlide: 8,
//             showNumbers: false,
//           });

//           const { baseMovie, recommended } = await fetchBecauseYouWatchedMovies();
//           const formattedWatchedRecs = recommended.map((movie) => ({
//             ...movie,
//             posterUrl: fetchPoster(
//               movie.title
//                 .normalize('NFD')
//                 .replace(/[:'()'!.&-]/g, '')
//                 .trim()
//             ),
//           }));
//           updatedCarousels.unshift({
//             title: `Because You Watched ${baseMovie.liked}`,
//             movies: formattedWatchedRecs,
//             itemsPerSlide: 8,
//             showNumbers: false,
//           });
//         } catch (err) {
//           console.error('Error loading personalized carousels:', err);
//         }
//       } else {
//         console.info('No username in localStorage — skipping personalized carousels.');
//       }

//       setCarousels(updatedCarousels);
//     }

//     loadData();
//   }, []);

//   // Handle scroll to load more carousels
//   const handleScroll = () => {
//     const bottom = window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;
//     if (bottom) {
//       // Load more carousels if there are more to load
//       if (loadedCarousels < carousels.length) {
//         setLoadedCarousels((prev) => prev + 5); // Load next 5 carousels
//       }
//     }
//   };

//   // Attach scroll event listener
//   useEffect(() => {
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll); // Cleanup on unmount
//   }, [loadedCarousels]);

//   const handlePosterError = (carouselTitle: string, movieId: string) => {
//     setCarousels((prevCarousels) =>
//       prevCarousels.map((carousel) =>
//         carousel.title === carouselTitle
//           ? {
//               ...carousel,
//               movies: carousel.movies.filter(
//                 (movie) => movie.show_id !== movieId
//               ),
//             }
//           : carousel
//       )
//     );
//   };

//   const scroll = (
//     carouselTitle: string,
//     direction: 'left' | 'right',
//     itemsPerSlide: number
//   ) => {
//     const container = carouselRefs.current[carouselTitle];
//     if (!container) return;
//     const card = container.querySelector('div');
//     if (!card) return;
//     const cardWidth = (card as HTMLElement).offsetWidth + 24;
//     const scrollAmount = cardWidth * itemsPerSlide;
//     if (direction === 'left') {
//       if (container.scrollLeft <= 0) {
//         container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
//       } else {
//         container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
//       }
//     } else {
//       if (
//         container.scrollLeft + container.clientWidth >=
//         container.scrollWidth - 10
//       ) {
//         container.scrollTo({ left: 0, behavior: 'smooth' });
//       } else {
//         container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
//       }
//     }
//   };

//   return (
//     <AuthorizeView>
//       <div className="home-container">
//         <div className="home-content">
//           <TopAppBar />

//           {/* 🎥 Hero Video Section */}
//           <div className="hero-video-container">
//             <video autoPlay loop muted playsInline className="hero-video">
//               <source src="/movietrailer.mp4" type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//             <div className="hero-overlay">
//               <h1 className="hero-title">MANIFEST</h1>
//               <button className="hero-button-5">Play</button>
//             </div>
//           </div>

//           {/* CATEGORIES */}
//           <div className="category-row">
//             {['Action', 'Horror', 'Comedy', 'Romance', 'Adventure'].map(
//               (category) => (
//                 <div key={category} className="category-box">
//                   {category}
//                 </div>
//               )
//             )}
//           </div>

//           {/* TOP 5 */}
//           <h2 className="top10title">Top 5 in the U.S. Today</h2>
//           <div className="top10-row">
//             {[...Array(5)].map((_, index) => (
//               <div className="top10-item" key={index}>
//                 <span className="rank-number">{index + 1}</span>
//                 <img
//                   src={`./top10/movie${index + 1}.jpg`}
//                   alt={`Top ${index + 1}`}
//                   className="top10-poster"
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Carousels */}
//           {carousels.slice(0, loadedCarousels).map((carousel) => (
//             <section key={carousel.title} className="carousel-section">
//               <div className="carousel-title-bar">
//                 <h2 className="section-title">{carousel.title}</h2>
//               </div>
//               <div className="carousel-hover-group">
//                 <button
//                   className="scroll-button left"
//                   onClick={() =>
//                     scroll(carousel.title, 'left', carousel.itemsPerSlide)
//                   }
//                 />
//                 <div
//                   className={`horizontal-carousel ${
//                     carousel.showNumbers
//                       ? 'horizontal-carousel-top'
//                       : 'horizontal-carousel-normal'
//                   }`}
//                   ref={(el: HTMLDivElement | null) => {
//                     if (el) carouselRefs.current[carousel.title] = el;
//                   }}
//                 >
//                   {carousel.movies.map((movie, index) => (
//                     <div
//                       key={movie.show_id}
//                       className={
//                         carousel.showNumbers
//                           ? 'top-movie-item'
//                           : 'recommendation-item'
//                       }
//                     >
//                       {carousel.showNumbers && (
//                         <div className="top-movie-number">{index + 1}</div>
//                       )}
//                       {movie.posterUrl && (
//                         <div
//                           onClick={() => setSelectedMovie(movie)}
//                           style={{ cursor: 'pointer' }}
//                         >
//                           <img
//                             src={movie.posterUrl}
//                             alt={movie.title}
//                             onError={() =>
//                               handlePosterError(carousel.title, movie.show_id)
//                             }
//                             className={
//                               carousel.showNumbers
//                                 ? 'top-movie-poster'
//                                 : 'recommendation-image'
//                             }
//                           />
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 <button
//                   className="scroll-button right"
//                   onClick={() =>
//                     scroll(carousel.title, 'right', carousel.itemsPerSlide)
//                   }
//                 />
//               </div>
//             </section>
//           ))}
//         </div>

//         <CookieConsent>
//           This website uses cookies to enhance the user experience.
//         </CookieConsent>

//         {selectedMovie && (
//           <MovieModal
//             movie={selectedMovie}
//             onClose={() => setSelectedMovie(null)}
//             onMovieSelect={(newMovie) => setSelectedMovie(newMovie)}
//           />
//         )}
//       </div>
//     </AuthorizeView>
//   );
// }

// import { useEffect, useRef, useState } from 'react';
// import { Link } from 'react-router-dom';
// import './HomePage.css';
// import CookieConsent from 'react-cookie-consent';
// import { Carousel } from '../types/Carousel';
// import getCarouselsFromGenres from '../utils/getCarouselsFromGenres';
// import TopAppBar from '../components/TopAppBar';
// import MovieModal from './MovieModal';
// import { Movie } from '../types/Movie';
// import {
//   fetchBecauseYouWatchedMovies,
//   fetchUserRecommendedMovies,
// } from '../api/MovieAPIs';
// import fetchPoster from '../utils/fetchPoster';
// import AuthorizeView from '../components/AuthorizeView';

// export default function HomePage() {
//   const [carousels, setCarousels] = useState<Carousel[]>([]);
//   const carouselRefs = useRef<Record<string, HTMLDivElement | null>>({});
//   const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

//   // Fetch carousels on load
//   useEffect(() => {
//     async function loadData() {
//       const baseCarousels = await getCarouselsFromGenres();
//       const updatedCarousels = [...baseCarousels];

//       const username = localStorage.getItem('username');

//       if (username) {
//         try {
//           const userRecs: Movie[] = await fetchUserRecommendedMovies();
//           const formattedUserRecs = userRecs.map((movie) => ({
//             ...movie,
//             posterUrl: fetchPoster(
//               movie.title
//                 .normalize('NFD')
//                 .replace(/[:'()'!.&-]/g, '')
//                 .trim()
//             ),
//           }));
//           updatedCarousels.unshift({
//             title: 'Recommended For You',
//             movies: formattedUserRecs,
//             itemsPerSlide: 8,
//             showNumbers: false,
//           });

//           const { baseMovie, recommended } =
//             await fetchBecauseYouWatchedMovies();
//           const formattedWatchedRecs = recommended.map((movie) => ({
//             ...movie,
//             posterUrl: fetchPoster(
//               movie.title
//                 .normalize('NFD')
//                 .replace(/[:'()'!.&-]/g, '')
//                 .trim()
//             ),
//           }));
//           updatedCarousels.unshift({
//             title: `Because You Watched ${baseMovie.liked}`,
//             movies: formattedWatchedRecs,
//             itemsPerSlide: 8,
//             showNumbers: false,
//           });
//         } catch (err) {
//           console.error('Error loading personalized carousels:', err);
//         }
//       } else {
//         console.info('No username in localStorage — skipping personalized carousels.');
//       }

//       setCarousels(updatedCarousels);
//     }

//     loadData();
//   }, []);

//   const handlePosterError = (carouselTitle: string, movieId: string) => {
//     setCarousels((prevCarousels) =>
//       prevCarousels.map((carousel) =>
//         carousel.title === carouselTitle
//           ? {
//               ...carousel,
//               movies: carousel.movies.filter(
//                 (movie) => movie.show_id !== movieId
//               ),
//             }
//           : carousel
//       )
//     );
//   };

//   const scroll = (
//     carouselTitle: string,
//     direction: 'left' | 'right',
//     itemsPerSlide: number
//   ) => {
//     const container = carouselRefs.current[carouselTitle];
//     if (!container) return;
//     const card = container.querySelector('div');
//     if (!card) return;
//     const cardWidth = (card as HTMLElement).offsetWidth + 24;
//     const scrollAmount = cardWidth * itemsPerSlide;
//     if (direction === 'left') {
//       if (container.scrollLeft <= 0) {
//         container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
//       } else {
//         container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
//       }
//     } else {
//       if (
//         container.scrollLeft + container.clientWidth >=
//         container.scrollWidth - 10
//       ) {
//         container.scrollTo({ left: 0, behavior: 'smooth' });
//       } else {
//         container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
//       }
//     }
//   };

//   return (
//     <AuthorizeView>
//       <div className="home-container">
//         <div className="home-content">
//           <TopAppBar />

//           {/* 🎥 Hero Video Section */}
//           <div className="hero-video-container">
//             <video autoPlay loop muted playsInline className="hero-video">
//               <source src="/movietrailer.mp4" type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//             <div className="hero-overlay">
//               <h1 className="hero-title">MANIFEST</h1>
//               <button className="hero-button-5">Play</button>
//             </div>
//           </div>

//           {/* CATEGORIES */}
//           <div className="category-row">
//             {['Action', 'Horror', 'Comedy', 'Romance', 'Adventure'].map(
//               (category) => (
//                 <div key={category} className="category-box">
//                   {category}
//                 </div>
//               )
//             )}
//           </div>

//           {/* TOP 5 */}
//           <h2 className="top10title">Top 5 in the U.S. Today</h2>
//           <div className="top10-row">
//             {[...Array(5)].map((_, index) => (
//               <div className="top10-item" key={index}>
//                 <span className="rank-number">{index + 1}</span>
//                 <img
//                   src={`./top10/movie${index + 1}.jpg`}
//                   alt={`Top ${index + 1}`}
//                   className="top10-poster"
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Carousels */}
//           {carousels.map((carousel) => (
//             <section key={carousel.title} className="carousel-section">
//               <div className="carousel-title-bar">
//                 <h2 className="section-title">{carousel.title}</h2>
//               </div>
//               <div className="carousel-hover-group">
//                 <button
//                   className="scroll-button left"
//                   onClick={() =>
//                     scroll(carousel.title, 'left', carousel.itemsPerSlide)
//                   }
//                 />
//                 <div
//                   className={`horizontal-carousel ${
//                     carousel.showNumbers
//                       ? 'horizontal-carousel-top'
//                       : 'horizontal-carousel-normal'
//                   }`}
//                   ref={(el: HTMLDivElement | null) => {
//                     if (el) carouselRefs.current[carousel.title] = el;
//                   }}
//                 >
//                   {carousel.movies.map((movie, index) => (
//                     <div
//                       key={movie.show_id}
//                       className={
//                         carousel.showNumbers
//                           ? 'top-movie-item'
//                           : 'recommendation-item'
//                       }
//                     >
//                       {carousel.showNumbers && (
//                         <div className="top-movie-number">{index + 1}</div>
//                       )}
//                       {movie.posterUrl && (
//                         <div
//                           onClick={() => setSelectedMovie(movie)}
//                           style={{ cursor: 'pointer' }}
//                         >
//                           <img
//                             src={movie.posterUrl}
//                             alt={movie.title}
//                             onError={() =>
//                               handlePosterError(carousel.title, movie.show_id)
//                             }
//                             className={
//                               carousel.showNumbers
//                                 ? 'top-movie-poster'
//                                 : 'recommendation-image'
//                             }
//                           />
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 <button
//                   className="scroll-button right"
//                   onClick={() =>
//                     scroll(carousel.title, 'right', carousel.itemsPerSlide)
//                   }
//                 />
//               </div>
//             </section>
//           ))}
//         </div>

//         <CookieConsent>
//           This website uses cookies to enhance the user experience.
//         </CookieConsent>

//         {selectedMovie && (
//           <MovieModal
//             movie={selectedMovie}
//             onClose={() => setSelectedMovie(null)}
//             onMovieSelect={(newMovie) => setSelectedMovie(newMovie)}
//           />
//         )}
//       </div>
//     </AuthorizeView>
//   );
// }
