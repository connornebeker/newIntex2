import { useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import fetchPoster from '../utils/fetchPoster';

const loginTitles: string[] = [
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

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberme, setRememberme] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // For carousels
  const rows = 5;
  const postersPerRow = Math.ceil(loginTitles.length / rows);
  const grouped = Array.from({ length: rows }, (_, i) =>
    loginTitles.slice(i * postersPerRow, (i + 1) * postersPerRow)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    if (type === 'checkbox') setRememberme(checked);
    else if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!email || !password) return setError('Please fill in all fields.');

    const loginUrl = rememberme
      ? 'https://localhost:5000/login?useCookies=true'
      : 'https://localhost:5000/login?useSessionCookies=true';

    try {
      // Step 1: Log in
      const response = await fetch(loginUrl, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const text = await response.text();
        let message = 'Login failed';
        try {
          const data = JSON.parse(text);
          message = data.message || message;
        } catch (_) {}
        throw new Error(message);
      }

      // Step 2: Wait for browser to store the cookie, then hit secure route
      const answer = await fetch(
        `https://localhost:5000/api/Movie/loginStuff/${email}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      if (!answer.ok) throw new Error('Failed to fetch user info');

      const dataRec = await answer.text();
      if (!dataRec) throw new Error('No username received from server');

      localStorage.setItem('username', dataRec);
      navigate('/home');
    } catch (error: any) {
      setError(error.message || 'Error logging in.');
    }
  };

  return (
    <div className="login-wrapper">
      {/* <img
        src="/background.png"
        alt="Background"
        className="login-background"
      /> */}
      <div className="login-overlay" />

      {/* Logo Header */}
      <header className="landing-header">
        <img src="/logo.png" alt="CineNiche Logo" className="logo-top" />
      </header>

      <div className="poster-carousel">
        {grouped.map((group, rowIndex) => (
          <div
            key={rowIndex}
            className={`carousel-row ${
              rowIndex % 2 === 0 ? 'scroll-left' : 'scroll-right'
            }`}
          >
            {[...group, ...group].map((title, i) => (
              <img
                key={`${title}-${i}`}
                src={fetchPoster(title)}
                alt={`poster-${title}`}
                className="poster-img"
                onError={(e) => {
                  const fallbackUrl = `https://dummyimage.com/300x450/cccccc/000000&text=${encodeURIComponent(
                    title
                  )}`;
                  (e.target as HTMLImageElement).src = fallbackUrl;
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="login-content">
        <div className="login-card">
          <h2>Sign In</h2>
          <p className="subtitle">Access your curated movie experience</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              required
            />
            <div className="login-options">
              <label>
                <input
                  type="checkbox"
                  name="rememberme"
                  checked={rememberme}
                  onChange={handleChange}
                />
                Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit">Sign In</button>
            <button type="button" onClick={() => navigate('/register')}>
              Register
            </button>
            {error && <p className="login-error">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
