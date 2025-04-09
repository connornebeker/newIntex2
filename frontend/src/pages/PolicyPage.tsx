import React from 'react';
import './PolicyPage.css';
import { Link } from 'react-router-dom';

const PolicyPage: React.FC = () => {
  return (
    <div>
      {/* Header */}
      <header className="admin-header">
        <div className="logo">
          <img src="/logo.png" alt="CineNiche Logo" className="logo-top" />
        </div>

        <nav className="nav-links">
          <Link to="/home" className="nav-link">
            Home
          </Link>
          <Link to="/movies" className="nav-link">
            Movies
          </Link>
          <Link to="/tvshows" className="nav-link">
            TV Shows
          </Link>
          <Link to="/watchlist" className="nav-link">
            Watchlist
          </Link>
        </nav>

        <div className="user-icon">{/* User icon can go here */}</div>
      </header>

      {/* Main Content */}
      <div className="policy-container">
        <h1>Privacy Policy</h1>
        <div className="effective-date">Effective Date: 04/07/2025</div>

        <h2>1. Information We Collect</h2>
        <p>
          At CineNiche (“we”, “us”, or “our”), your privacy is a top priority.
          This Privacy Policy explains how we collect, use, and protect your
          personal data when you use our website and services.
        </p>
        <p>
          When you use our website, we may collect the following types of
          personal data:
          <br />• <strong>Account Information</strong>: name, email, password.
          <br />• <strong>User Preferences</strong>: favorite genres, settings.
          <br />• <strong>Usage Data</strong>: movie reviews, browsing.
          <br />• <strong>Cookies</strong>: used for functionality, analytics,
          and personalization.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>We use your data for the following purposes:</p>
        <ul>
          <li>To create and manage your user account</li>
          <li>To personalize your experience</li>
          <li>To allow ratings and reviews</li>
          <li>To communicate support updates</li>
          <li>To analyze and improve our services</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2>3. Legal Basis for Processing</h2>
        <p>Under GDPR, we process data based on:</p>
        <ul>
          <li>Your consent</li>
          <li>Performance of a contract</li>
          <li>Legal obligations</li>
          <li>Legitimate interests</li>
        </ul>

        <h2>4. Cookies</h2>
        <p>We use cookies to:</p>
        <ul>
          <li>Keep you logged in</li>
          <li>Remember preferences</li>
          <li>Analyze traffic and patterns</li>
        </ul>
        <p>
          You can disable cookies in your browser, but some features may not
          work.
        </p>

        <h2>5. Data Sharing</h2>
        <p>We do not sell your data. We may share with:</p>
        <ul>
          <li>Trusted service providers</li>
          <li>Legal authorities if required</li>
          <li>Publicly only if you choose to (e.g., reviews)</li>
        </ul>

        <h2>6. Data Retention</h2>
        <p>We keep data as long as needed to:</p>
        <ul>
          <li>Provide services</li>
          <li>Comply with laws</li>
          <li>Resolve disputes</li>
          <li>Enforce policies</li>
        </ul>

        <h2>7. Your Rights (Under GDPR)</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access or correct your data</li>
          <li>Request deletion</li>
          <li>Restrict or object to processing</li>
          <li>Withdraw consent at any time</li>
          <li>Export your data</li>
          <li>Contact a data authority</li>
        </ul>

        <p>
          To exercise your rights, email us at:{' '}
          <strong>support@cineniche.com</strong>
        </p>

        <h2>8. Data Security</h2>
        <p>
          We use technical and organizational safeguards to protect your data.
        </p>

        <h2>9. International Transfers</h2>
        <p>
          If your data leaves the EEA, we use EU-approved safeguards like
          standard clauses.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy and notify you by email or on our
          site.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          CineNiche
          <br />
          support@cineniche.com
          <br />
          123 Cine Street, Film City, CA 90001
        </p>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} CineNiche. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PolicyPage;
