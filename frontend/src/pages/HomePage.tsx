import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import CookieConsent from 'react-cookie-consent';
import { Carousel } from '../types/Carousel';
import getCarouselsFromGenres from '../utils/getCarouselsFromGenres';
import TopAppBar from '../components/TopAppBar';
import MovieModal from './MovieModal';
import { Movie } from '../types/Movie';
import AuthorizeView from '../components/AuthorizeView';

const featuredMovies = ['darknight', 'godzilla', 'wicked', 'xmen'];
export default function HomePage() {
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  // Fetch carousels on load
  useEffect(() => {
    async function loadData() {
      const fetchedCarousels = await getCarouselsFromGenres();
      setCarousels(fetchedCarousels);
    }
    loadData();
  }, []);
  // Auto-slide featured carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === featuredMovies.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  // Remove Movies without Posters
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
  // Scroll behavior
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
        {/* Navigation */}
        <TopAppBar />
        {/* Hero Carousel */}
        <div className="carousel-container">
          <img
            src={`./posters2/${featuredMovies[currentSlide]}.jpg`}
            alt={`Featured: ${featuredMovies[currentSlide]}`}
            className="carousel-image"
          />
          <button
            className="carousel-nav prev"
            onClick={() =>
              setCurrentSlide(
                currentSlide === 0
                  ? featuredMovies.length - 1
                  : currentSlide - 1
              )
            }
          >
            &lt;
          </button>
          <button
            className="carousel-nav next"
            onClick={() =>
              setCurrentSlide((currentSlide + 1) % featuredMovies.length)
            }
          >
            &gt;
          </button>
          <div className="carousel-dots">
            {featuredMovies.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
        {/* CATEGORIES! */}
        <div className="category-row">
          {['Action', 'Horror', 'Comedy', 'Romance', 'Adventure'].map(
            (category) => (
              <div key={category} className="category-box">
                {category}
              </div>
            )
          )}
        </div>
        {/* TOP 5! */}
        {/* DON'T WORRY ABOUT THIS THING FOR NOW!! */}
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
        {/* Dynamic Carousels */}
        {carousels.map((carousel) => (
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
