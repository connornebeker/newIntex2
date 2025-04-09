import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // reuse background styles
import './LoginPage.css';   // updated login styles

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberme, setRememberme] = useState(false);
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    if (type === 'checkbox') setRememberme(checked);
    else if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const loginUrl = rememberme
      ? 'https://localhost:5000/login?useCookies=true'
      : 'https://localhost:5000/login?useSessionCookies=true';

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        credentials: 'include', // ✅ Ensures cookies are sent & received
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Ensure we only parse JSON if there is content
      let data = null;
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength, 10) > 0) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Invalid email or password.');
      }

      navigate('/home');
    } catch (error: any) {
      setError(error.message || 'Error logging in.');
      console.error('Fetch attempt failed:', error);
    }
  };

  
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setError('');
  //   if (!email || !password) return setError('Please fill in all fields.');

  //   try {
  //     const response = await fetch('https://localhost:5000/login', {
  //       method: 'POST',
  //       credentials: 'include',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     if (!response.ok) {
  //       const data = await response.json();
  //       throw new Error(data.message || 'Login failed');
  //     }

  //     navigate('/home');
  //   } catch (error: any) {
  //     setError(error.message || 'Error logging in.');
  //   }
  // };

  return (
    <div className="login-wrapper">
      <img src="/background.png" alt="Background" className="login-background" />
      <div className="login-overlay" />

      {/* Logo Header */}
      <header className="landing-header">
        <img src="/logo.png" alt="CineNiche Logo" className="logo-top" />
      </header>

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
