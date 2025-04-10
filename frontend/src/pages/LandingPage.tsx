import { JSX } from 'react';
import './LandingPage.css';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import fetchPoster from '../utils/fetchPoster';

const titles: string[] = [
  'Money Heist From Tokyo to Berlin',
  'The Witcher Nightmare of the Wolf',
  'My Little Pony Friendship Is Magic',
  'The Queen',
  'Avengers Climate Conundrum',
  'LEGO Friends The Power of Friendship',
  'Barney and Friends',
  'House of Cards',
  'LEGO Marvel SpiderMan Vexed by Venom',
  'All My Friends Are Dead',
  'Friendsgiving',
  'Graceful Friends',
  'Kongsuni and Friends',
  'The Queens Gambit',
  'Fishermans Friends',
  'Batman The Killing Joke',
  'Girlfriends',
  'Waiting for Superman',
  'The Crown',
  'Avatar The Last Airbender',
  'Stranger Things',
  'A Wednesday',
  'The Great British Baking Show',
  'Squid Game',
  'Lucifer',
  'The Good Place',
  'John Mulaney The Comeback Kid',
  'Money Heist From Tokyo to Berlin',
  'The Witcher Nightmare of the Wolf',
  'Manifest',
  'Inception',
  'The Last Dance',
  'Avengers Climate Conundrum',
  'Lupin',
  'You vs Wild Out Cold',
  'The Last Letter From Your Lover',
  'Catch Me If You Can',
  'Young Royals',
  'Avengers Climate Conundrum',
  'Jurassic World Camp Cretaceous',
  'Twins Mission',
  'Joker',
  'The Frozen Dead',
  'Mission Blue',
  'A Mission in an Old Movie',
  'Frozen River',
  'Turbo FAST',
  'Cooked',
  'He Never Died',
  'Chelsea Does',
  'Your lie in April',
  'My Beautiful Broken Brain',
  'Ip Man',
  'Justin Time',
  'Frank and Cindy',
  'Cyborg 009 VS Devilman',
  'Hush',
  'Belgica',
  'Team Foxcatcher',
  'Special Correspondents',
  '72 Dangerous Places to Live',
  '72 Cutest Animals',
  'Ip Man 3',
  'Ip Man 2',
  'Chris Tucker Live',
  'Creep',
  'Tig',
  'Wet Hot American Summer',
  '6 Years',
  'Circle',
  'Beasts of No Nation',
  'Results',
  'Hemlock Grove',
  'Walt Disney Animation Studios Short Films Collection',
  'Manson Family Vacation',
  'Atelier',
  'A Very Murray Christmas',
  'The Ridiculous 6',
  'The Fundamentals of Caring',
  'Amanda Knox',
  'Extremis',
  'Sample This',
  'The White Helmets',
  'ARQ',
  'VeggieTales in the House',
  'When I See You Again',
  'Umrika',
  'Someone Like You',
  'Old Money',
  'My Big Night',
  'Much Ado About Nothing',
  'Love Cheque Charge',
  'Harud',
  'Marvel Anime Wolverine',
  'Marvel Anime XMen',
  'LEGO Jurassic World Secret Exhibit',
  'LEGO Ninjago',
  'Thomas and Friends',
  'True Friendship Day',
  'Making The Witcher',
  'Dear My Friends',
  'Friendship',
  'Talking Tom and Friends',
  'My Little Pony A New Generation',
  'The Great British Baking Show',
  'Dear White People',
  'Tayo and Little Wizards',
  'Nailed It',
  'Jack Whitehall Travels with My Father',
  'Tayo the Little Bus',
  'Heroes of Goo Jit Zu',
  'Pororo  The Little Penguin',
  'Barbie Big City Big Dreams',
  'Freedom Writers',
  'Initial D',
  'The Ingenuity of the Househusband',
  'Shor In the City',
  'Titletown High',
  'Clickbait',
  'John of God The Crimes of a Spiritual Healer',
  'Untold Caitlyn Jenner',
];

export default function LandingPage(): JSX.Element {
  const rows = 5;
  const postersPerRow = Math.ceil(titles.length / rows);
  const navigate = useNavigate();
  const grouped = Array.from({ length: rows }, (_, i) =>
    titles.slice(i * postersPerRow, (i + 1) * postersPerRow)
  );

  return (
    <div className="landing-container">
      {/* Background Carousel Grid */}
      <header className="landing-header">
        <img src="/logo.png" alt="CineNiche Logo" className="logo-top" />
        <button className="signin-button" onClick={() => navigate('/login')}>
          Sign In
        </button>
      </header>
      <div className="poster-carousel">
        {grouped.map((group, rowIndex) => (
          <div
            key={rowIndex}
            className={`carousel-row ${rowIndex % 2 === 0 ? 'scroll-left' : 'scroll-right'}`}
          >
            {[...group, ...group].map((title, i) => (
              <img
                key={`${title}-${i}`}
                src={fetchPoster(title)} // ✅ remote Azure URL
                alt={`poster-${title}`}
                className="poster-img"
                onError={(e) => {
                  const fallbackUrl = `https://dummyimage.com/300x450/cccccc/000000&text=${encodeURIComponent(title)}`;
                  (e.target as HTMLImageElement).src = fallbackUrl;
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Overlay Gradient */}
      <div className="overlay" />

      {/* Foreground Content */}
      <div className="content">
        <div className="hero-card">
          <h1 className="title">Curated Cinema. Rare Gems.</h1>
          <p className="subtitle">
            Unlimited indie, international, and cult classics.
          </p>
          <form className="cta-form">
            <div className="cta-row">
              <input
                type="email"
                placeholder="Email address"
                className="email-input"
              />
              <button
                className="cta-button"
                onClick={() => navigate('/register')}
              >
                Get Started
              </button>
            </div>
          </form>

          <Footer />
        </div>
      </div>
    </div>
  );
}
