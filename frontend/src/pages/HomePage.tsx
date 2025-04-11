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
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [loadedCarousels, setLoadedCarousels] = useState(5); // Track the number of carousels loaded
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // used with referrencing carousels and loading more carousels
  const carouselRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const loadMoreRef = useRef<HTMLDivElement | null>(null); // Ref to the div at the bottom

  // retrieve all movies
  async function fetchMoviesByTitles(): Promise<Movie[]> {
    const res = await fetch(
      `https://intex-group2-7-backend-duahbmbxaggha8e2.eastus-01.azurewebsites.net/api/Movie/GetMoviesByTitles`,
      {
        credentials: 'include',
      }
    );

    const data = await res.json();
    return data.map((movie: Movie) => ({
      ...movie,
      posterUrl: fetchPoster(
        movie.title
          .normalize('NFD')
          .replace(/[:'()’!.&-]/g, '')
          .trim()
      ),
    }));
  }

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
          const top10Movies = await fetchMoviesByTitles();

          updatedCarousels.unshift({
            title: 'Top 10 Today',
            movies: top10Movies,
            itemsPerSlide: 5,
            showNumbers: true,
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

  // lazy load movies
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

  // handles what happens when a movie title does not match the poster
  // const handlePosterError = (carouselTitle: string, movieId: string) => {
  //   setCarousels((prevCarousels) =>
  //     prevCarousels.map((carousel) =>
  //       carousel.title === carouselTitle
  //         ? {
  //             ...carousel,
  //             movies: carousel.movies.filter(
  //               (movie) => movie.show_id !== movieId
  //             ),
  //           }
  //         : carousel
  //     )
  //   );
  // };

  // horizontal scrolling function for carousels
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
              {/* <h1 className="hero-title">MANIFEST</h1> */}
              <img
                src="/anyone.png"
                alt="Anyone But You"
                className="hero-title-image"
              />
              <button className="hero-button-5">Play</button>
            </div>
          </div>
        </div>
        <div className="home-content-2">
          {/* CATEGORIES */}
          <div className="category-row">
            {[
              { name: 'Action', key: 'Action' },
              { name: 'Comedies', key: 'Comedies' },
              { name: 'Thrillers', key: 'Thrillers' },
              { name: 'Family Movies', key: 'FamilyMovies' },
              { name: 'Romantic Comedies', key: 'ComediesRomanticMovies' },
            ].map(({ name, key }) => (
              <Link key={key} to={`/category/${key}`} className="category-box">
                {name}
              </Link>
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
                        <div
                          className={`top-movie-number ${
                            index === 9 ? 'number-ten-adjust' : ''
                          }`}
                        >
                          {index + 1}
                        </div>
                      )}

                      {movie.posterUrl && (
                        <div
                          onClick={() => setSelectedMovie(movie)}
                          style={{ cursor: 'pointer' }}
                        >
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            onError={(e) => {
                              const fallbackUrl = `https://dummyimage.com/300x450/cccccc/000000&text=${encodeURIComponent(movie.title)}`;
                              (e.target as HTMLImageElement).src = fallbackUrl;
                            }}
                            className={
                              carousel.showNumbers
                                ? `top-movie-poster ${index === 9 ? 'poster-ten-shift' : ''}`
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
