import TopAppBar from '../components/TopAppBar';
import CategoryCards from '../components/CategoryCards';
import AuthorizeView from '../components/AuthorizeView';

export default function CategoryPage() {
  

  return (
    <>
    {/* <AuthorizeView> */}
      <TopAppBar />
      <CategoryCards />
      {/* </AuthorizeView> */}
    </>
  );
}

// export default function CategoryPage() {
//   const [carousels, setCarousels] = useState<Carousel[]>([]);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const carouselRefs = useRef<Record<string, HTMLDivElement | null>>({});
//   // Fetch carousels on load
//   useEffect(() => {
//     async function loadData() {
//       const fetchedCarousels = await getCarouselsFromGenres();
//       setCarousels(fetchedCarousels);
//     }
//     loadData();
//   }, []);
//   // Auto-slide featured carousel
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) =>
//         prev === featuredMovies.length - 1 ? 0 : prev + 1
//       );
//     }, 5000);
//     return () => clearInterval(timer);
//   }, []);
//   // Scroll behavior
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
//     <div className="home-container">
//       <div className="home-content">
//         {/* Navigation */}
//         <nav className="nav-container">
//           <div className="nav-left">
//             <img src="/logo.png" alt="CineNiche Logo" className="logo" />
//             <div className="nav-links">
//               <Link to="/" className="nav-link">
//                 Home
//               </Link>
//               <Link to="/movies" className="nav-link">
//                 Categories
//               </Link>
//               <Link to="/tv-shows" className="nav-link">
//                 TV Shows
//               </Link>
//               <Link to="/watchlist" className="nav-link">
//                 Watchlist
//               </Link>
//             </div>
//           </div>
//           <div className="nav-right">
//             <input
//               type="search"
//               placeholder="Search..."
//               className="search-input"
//               aria-label="Search movies and TV shows"
//             />
//             <svg
//               width="37"
//               height="37"
//               viewBox="0 0 37 37"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//               className="user-icon"
//             >
//               <path
//                 d="M30.8333 32.375V29.2917C30.8333 27.6562 30.1836 26.0876 29.0271 24.9312C27.8706 23.7747 26.3021 23.125 24.6666 23.125H12.3333C10.6978 23.125 9.12927 23.7747 7.9728 24.9312C6.81633 26.0876 6.16663 27.6562 6.16663 29.2917V32.375M24.6666 10.7917C24.6666 14.1974 21.9057 16.9583 18.5 16.9583C15.0942 16.9583 12.3333 14.1974 12.3333 10.7917C12.3333 7.38591 15.0942 4.625 18.5 4.625C21.9057 4.625 24.6666 7.38591 24.6666 10.7917Z"
//                 stroke="white"
//                 strokeWidth="4"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </div>
//         </nav>
//         {/* Hero Carousel */}
//         <div className="carousel-container">
//           <img
//             src={`./posters/${featuredMovies[currentSlide]}.jpg`}
//             alt={`Featured: ${featuredMovies[currentSlide]}`}
//             className="carousel-image"
//           />
//           <button
//             className="carousel-nav prev"
//             onClick={() =>
//               setCurrentSlide(
//                 currentSlide === 0
//                   ? featuredMovies.length - 1
//                   : currentSlide - 1
//               )
//             }
//           >
//             &lt;
//           </button>
//           <button
//             className="carousel-nav next"
//             onClick={() =>
//               setCurrentSlide((currentSlide + 1) % featuredMovies.length)
//             }
//           >
//             &gt;
//           </button>
//           <div className="carousel-dots">
//             {featuredMovies.map((_, index) => (
//               <button
//                 key={index}
//                 className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
//                 onClick={() => setCurrentSlide(index)}
//               />
//             ))}
//           </div>
//         </div>
//         {/* Dynamic Carousels */}
//         {carousels.map((carousel) => (
//           <section key={carousel.title} className="carousel-section">
//             <div className="carousel-title-bar">
//               <h2 className="section-title">{carousel.title}</h2>
//             </div>
//             <div className="carousel-hover-group">
//               <button
//                 className="scroll-button left"
//                 onClick={() =>
//                   scroll(carousel.title, 'left', carousel.itemsPerSlide)
//                 }
//               />
//               <div
//                 className={`horizontal-carousel ${
//                   carousel.showNumbers
//                     ? 'horizontal-carousel-top'
//                     : 'horizontal-carousel-normal'
//                 }`}
//                 ref={(el: HTMLDivElement | null) => {
//                   if (el) carouselRefs.current[carousel.title] = el;
//                 }}
//               >
//                 {carousel.movies.map((movie, index) => (
//                   <div
//                     key={movie.show_id}
//                     className={
//                       carousel.showNumbers
//                         ? 'top-movie-item'
//                         : 'recommendation-item'
//                     }
//                   >
//                     {carousel.showNumbers && (
//                       <div className="top-movie-number">{index + 1}</div>
//                     )}
//                     {movie.posterUrl && (
//                       <Link to={`/movies/${movie.show_id}`} state={{ movie }}>
//                         <img
//                           src={movie.posterUrl}
//                           alt={movie.title}
//                           className={ carousel.showNumbers
//                                   ? 'top-movie-poster'
//                                 : 'recommendation-image'}
//                         />
//                     </Link>

//                       // <img
//                       //   src={movie.posterUrl}
//                       //   alt={movie.title}
//                       //   className={
//                       //     carousel.showNumbers
//                       //       ? 'top-movie-poster'
//                       //       : 'recommendation-image'
//                       //   }
//                       // />
//                     )}
//                   </div>
//                 ))}
//               </div>
//               <button
//                 className="scroll-button right"
//                 onClick={() =>
//                   scroll(carousel.title, 'right', carousel.itemsPerSlide)
//                 }
//               />
//             </div>
//           </section>
//         ))}
//       </div>
//       <CookieConsent>
//         This website uses cookies to enhance the user experience.
//       </CookieConsent>
//     </div>
//   );
// }
