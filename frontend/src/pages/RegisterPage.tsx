import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const navigate = useNavigate();

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
      fetch('https://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
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
    <div className="register-page">
      <header className="register-header">
        <img src="/logo.png" alt="Logo" className="logo" />
        <button className="signin-btn" onClick={handleLoginClick}>
          Sign In
        </button>
      </header>

      <div className="background-section">
        <div className="fade-bottom" />

        <div className="login-card-1">
          <div className="centered-text">
            <h1>Unlimited movies, TV shows, and more</h1>
            <h2>Ready to join? Create your account now.</h2>

            <form className="register-form" onSubmit={handleSubmit}>
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
              <strong>{error && <p className="error">{error}</p>}</strong>
            </form>
          </div>
        </div>
      </div>

      {/* Reasons to Join + FAQ */}
      <div className="extras-container">
        <section className="reasons">
          <h2 className="section-title">More Reasons to Join</h2>
          <div className="reasons-grid">
            <div className="reason-card">
              <div className="reason-icon">📺</div>
              <h3>Enjoy on your TV</h3>
              <p>Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.</p>
            </div>
            <div className="reason-card">
              <div className="reason-icon">📥</div>
              <h3>Download your shows to watch offline</h3>
              <p>Save your favorites easily and always have something to watch.</p>
            </div>
            <div className="reason-card">
              <div className="reason-icon">📱</div>
              <h3>Watch everywhere</h3>
              <p>Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.</p>
            </div>
            <div className="reason-card">
              <div className="reason-icon">🧒</div>
              <h3>Create profiles for kids</h3>
              <p>Send kids on adventures with their favorite characters in a space made just for them — free with your membership.</p>
            </div>
          </div>
        </section>

        <section className="faq">
          <h2 className="section-title">Frequently Asked Questions</h2>
          {[
            {
              q: 'What is CineNiche?',
              a: 'CineNiche is a streaming service that offers a wide variety of curated movies including indie, international, and cult classics.',
            },
            {
              q: 'How much does CineNiche cost?',
              a: 'Plans start at just $7.99/month. Cancel anytime.',
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
              className={`faq-item ${i === expandedIndex ? 'open' : ''}`}
              onClick={() => setExpandedIndex(i === expandedIndex ? null : i)}
            >
              <div className="faq-question">
                <span>{faq.q}</span>
                <span>{i === expandedIndex ? '✖' : '+'}</span>
              </div>
              {i === expandedIndex && <div className="faq-answer">{faq.a}</div>}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default Register;
