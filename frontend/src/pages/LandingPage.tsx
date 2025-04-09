import { JSX } from 'react';
import './LandingPage.css';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';


const titles: string[] = [
  'Countdown: Inspiration4 Mission to Space',
  'Mission Istaanbul: Darr Ke Aagey Jeet Hai',
  'Avengers Climate Conundrum',
  'Jurassic World Camp Cretaceous',
  'Motu Patlu: Mission Moon',
  'Men on a Mission',
  'Operation Varsity Blues: The College Admissions Scandal',
  'LEGO Marvel Spider-Man: Vexed by Venom',
  'LEGO Jurassic World: Legend of Isla Nublar',
  'LEGO Jurassic World: Secret Exhibit',
  'Batman: The Killing Joke',
  'High & Low The Movie 3 / Final Mission',
  'Hope Frozen: A Quest to Live Twice',
  'Merry Men 2: Another Mission',
  'Twins Mission',
  'Hajwala 2: Mysterious Mission',
  'Lego DC Comics: Batman Be-Leaguered',
  'Spy Kids: Mission Critical',
  'Joker',
  'The Frozen Dead',
  'LEGO Marvel Super Heroes: Avengers Reassembled!',
  'LEGO Jurassic World: The Indominus Escape',
  'Mission Blue',
  'A Mission in an Old Movie',
  'Avengers: Infinity War',
  'Frozen Planet',
  'Frozen Planet: On Thin Ice',
  'Frozen Planet: The Epic Journey',
  'Frozen River',
  'Lego Friends: Girls on a Mission',
  '22-Jul',
  '15-Aug',
  '9-Feb',
  "Masha's Tales",
  'Turbo FAST',
  'Hannibal Buress: Comedy Camisado',
  'Care Bears & Cousins',
  'Cooked',
  'He Never Died',
  'Chelsea Does',
  'Marvel Super Hero Adventures: Frost Fight!',
  'Crouching Tiger Hidden Dragon: Sword of Destiny',
  'Your lie in April',
  'Netflix Presents: The Characters',
  "Pee-wee's Big Holiday",
  'My Beautiful Broken Brain',
  'Jimmy Carr: Funny Business',
  'Kung Fu Panda: Secrets of the Scroll',
  'Ip Man',
  'Terrace House: Boys & Girls in the City',
  'Justin Time',
  'Frank and Cindy',
  'Cyborg 009 VS Devilman',
  'Hush',
  'Belgica',
  'Team Foxcatcher',
  'Special Correspondents',
  'The Do-Over',
  '72 Dangerous Places to Live',
  '72 Cutest Animals',
  'Hibana: Spark',
  'Bo Burnham: Make Happy',
  'Ip Man 3',
  "Ricardo O'Farrill Abrazo Genial",
  'Tom Segura: Mostly Stories',
  'Ip Man 2',
  'Danger Mouse: Classic Collection',
  'What Happened Miss Simone?',
  'Chris Tucker Live',
  'Creep',
  'H2O: Mermaid Adventures',
  'Tig',
  'Wet Hot American Summer',
  'Demetri Martin: Live (At the Time)',
  '6 Years',
  'Cowspiracy: The Sustainability Secret',
  'Keith Richards: Under the Influence',
  'Wakfu: The Quest for the Six Eliatrope Dofus',
  'Anjelah Johnson: Not Fancy',
  "Winter on Fire: Ukraine's Fight for Freedom",
  'Circle',
  'Beasts of No Nation',
  'Anthony Jeselnik: Thoughts and Prayers',
  'Results',
  'Hemlock Grove',
  'Walt Disney Animation Studios Short Films Collection',
  'Manson Family Vacation',
  'W/ Bob & David',
  'John Mulaney: The Comeback Kid',
  'Atelier',
  'A Very Murray Christmas',
  'Trailer Park Boys: Drunk High and Unemployed: Live in Austin',
  'The Ridiculous 6',
  "Mike Epps: Don't Take It Personal",
  'Sammy & Co',
  'Marco Polo: One Hundred Eyes',
  'The Fundamentals of Caring',
  'Sofía Niño de Rivera: Exposed',
  'Justin Time GO!',
  'Amanda Knox',
  "Chef's Table: France",
  'Extremis',
  'Sample This',
  'The White Helmets',
  'Cedric the Entertainer: Live from the Ville',
  'ARQ',
  'Tomasz Jachimek Jacek Stramik Laugh at Live',
  'The Best of Rafał Rutkowski Olka Szczęśniak',
  'Rafał Banaś Michał Leja Laugh out Loud',
  'Mariusz Kałamaga Karol Kopiec Wiolka Walaszczyk Hilarious Trio',
  'Katarzyna Piasecka Rafał Pacześ Seriously Funny',
  'Karol Modzelewski Łukasz „Lotek" Lodkowski No Offense',
  'VeggieTales in the House',
  'Iliza Shlesinger: Confirmed Kills',
  'When I See You Again',
  'X: Past Is Present',
  'Welcome Mr. President',
  'Unchained: The Untold Story of Freestyle Motocross',
  'Umrika',
  'Someone Like You',
  'Riphagen - The Untouchable',
  "Pac's Scary Halloween",
  'Old Money',
  'My Little Pony Equestria Girls: Legend of Everfree',
  'My Big Night',
  "Murphy's Law of Love",
  'Much Ado About Nothing',
  "Masha's Spooky Stories",
  'Love Cheque Charge',
  'Harud',
];

export default function LandingPage(): JSX.Element {
  const rows = 3;
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
        <button className="signin-button" onClick={() => navigate('/login')}>Sign In</button>
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
                src={`./posters/${title}.jpg`}
                alt={`poster-${title}`}
                className="poster-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
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
        <h1 className="title">Curated Cinema. Rare Gems.</h1>
        <p className="subtitle">
          Unlimited indie, international, and cult classics.
        </p>
        <form className="cta-form">
          <input
            type="email"
            placeholder="Email address"
            className="email-input"
          />
          <button className="cta-button" onClick={() => navigate('/register')}>Get Started</button>
        </form>
        <Footer />
      </div>
      
    </div>
  );
}