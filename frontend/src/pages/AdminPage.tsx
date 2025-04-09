import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './AdminPage.css';
import TopAppBar from '../components/TopAppBar';
import { Carousel } from '../types/Carousel';
import getCarouselsFromGenres from '../utils/getCarouselsFromGenres';
import AuthorizeView from '../components/AuthorizeView';

const AdminPage: React.FC = () => {
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const carouselRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    async function loadData() {
      const fetchedCarousels = await getCarouselsFromGenres();
      setCarousels(fetchedCarousels);
    }
    loadData();
  }, []);

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

  const filteredCarousels = carousels.map((carousel) => ({
    ...carousel,
    movies: carousel.movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  return (
    <AuthorizeView>
    <div className="admin-container">
      <TopAppBar />
      <main className="admin-content">
        <h1 className="admin-title">Admin Manager</h1>

        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search movies or TV shows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredCarousels.map((carousel) => (
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
                      <Link to={`/movies/${movie.show_id}`} state={{ movie }}>
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
                      </Link>
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
      </main>
    </div>
    </AuthorizeView>
  );
};

export default AdminPage;
