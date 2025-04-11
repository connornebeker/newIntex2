import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import fetchPoster from '../utils/fetchPoster';
import { useLocation } from 'react-router-dom';

const registerTitles: string[] = [
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

function Register() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  // For carousels
  const rows = 5;
  const postersPerRow = Math.ceil(registerTitles.length / rows);
  const grouped = Array.from({ length: rows }, (_, i) =>
    registerTitles.slice(i * postersPerRow, (i + 1) * postersPerRow)
  );
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const passedEmail = params.get('email') || ''; // fallback to empty string if null

  const [email, setEmail] = useState(passedEmail);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match.');
    } else {
      setError('');
      fetch(
        'https://intex-group2-7-backend-duahbmbxaggha8e2.eastus-01.azurewebsites.net/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      )
        .then((data) => {
          console.log(data);
          if (data.ok) setError('Successful registration. Please log in.');
          else setError('Error registering.');
        })
        .catch((error) => {
          console.error(error);
          setError('Error registering.');
        });
    }
  };

  return (
    <div className="register-wrapper">
      <header className="landing-header">
        <img src="/logo.png" alt="CineNiche Logo" className="logo-top" />
        <button className="signin-button" onClick={handleLoginClick}>
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
                src={fetchPoster(title)}
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

      <div className="login-overlay" />

      {/* Register Form Card */}
      <div className="login-content">
        <div className="login-card">
          <h2>Sign Up</h2>
          <p className="subtitle">Create your CineNiche account</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleChange}
            />
            <button type="submit">Register</button>
            <button type="button" onClick={handleLoginClick}>
              Back to Login
            </button>
            {error && <p className="login-error">{error}</p>}
          </form>
        </div>
      </div>

      {/* Reasons to Join + FAQ */}
      <div className="extras-container-8">
        <section className="reasons-8">
          <h2 className="section-title-8">More Reasons to Join</h2>
          <div className="reasons-grid-8">
            <div className="reason-card-8">
              <div className="reason-icon-8">📺</div>
              <h3>Enjoy on your TV</h3>
              <p>
                Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV,
                Blu-ray players, and more.
              </p>
            </div>
            <div className="reason-card-8">
              <div className="reason-icon-8">📥</div>
              <h3>Download your shows to watch offline</h3>
              <p>
                Save your favorites easily and always have something to watch.
              </p>
            </div>
            <div className="reason-card-8">
              <div className="reason-icon-8">📱</div>
              <h3>Watch everywhere</h3>
              <p>
                Stream unlimited movies and TV shows on your phone, tablet,
                laptop, and TV.
              </p>
            </div>
            <div className="reason-card-8">
              <div className="reason-icon-8">🧒</div>
              <h3>Create profiles for kids</h3>
              <p>
                Send kids on adventures with their favorite characters in a
                space made just for them — free with your membership.
              </p>
            </div>
          </div>
        </section>

        <section className="faq-8">
          <h2 className="section-title-8">Frequently Asked Questions</h2>
          {[
            {
              q: 'What is CineNiche?',
              a: 'CineNiche is a streaming service that offers a wide variety of curated movies including indie, international, and cult classics.',
            },
            {
              q: 'Where can I watch?',
              a: 'Watch anywhere, on your phone, tablet, laptop, smart TV, or streaming device.',
            },
            {
              q: 'How do I cancel?',
              a: 'You can cancel your subscription anytime in your account settings — no commitments.',
            },
            {
              q: 'What can I watch on CineNiche?',
              a: 'We offer indie gems, award-winning documentaries, global hits, and more. Content is always being added!',
            },
          ].map((faq, i) => (
            <div
              key={i}
              className={`faq-item-8 ${i === expandedIndex ? 'open' : ''}`}
              onClick={() => setExpandedIndex(i === expandedIndex ? null : i)}
            >
              <div className="faq-question-8">
                <span>{faq.q}</span>
                <span>{i === expandedIndex ? '✖' : '+'}</span>
              </div>
              {i === expandedIndex && (
                <div className="faq-answer-8">{faq.a}</div>
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default Register;
