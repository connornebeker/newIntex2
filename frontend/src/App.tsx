import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import MoviesPage from './pages/MoviesPage';
import PolicyPage from './pages/PolicyPage';
import Category from './pages/CategoryPage.tsx';
import CategoryMoviePage from './pages/CategoryMoviePage.tsx';
import SearchResultsPage from './pages/SearchResultsPage.tsx';
// import { useEffect } from 'react';

function App() {
  // // Enforce HTTPS
  // useEffect(() => {
  //   if (window.location.protocol !== 'https:') {
  //     window.location.href = `https://${window.location.host}${window.location.pathname}${window.location.search}`;
  //   }
  // }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/movies/:show_id" element={<MoviesPage />} />
          <Route path="/policy" element={<PolicyPage />} />
          <Route path="/category" element={<Category />} />
          <Route path="/category/:categoryName" element={<CategoryMoviePage />} />
          <Route path="/search" element={<SearchResultsPage />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;

// import './App.css';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import LandingPage from './pages/LandingPage';
// import HomePage from './pages/HomePage';
// import AdminPage from './pages/AdminPage';
// import MoviesPage from './pages/MoviesPage';
// import PolicyPage from './pages/PolicyPage';
// import Category from './pages/CategoryPage.tsx';
// import CategoryMoviePage from './pages/CategoryMoviePage.tsx';


// function App() {
  
//   return (
//     <>
//       <Router>
//         <Routes>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/home" element={<HomePage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/admin" element={<AdminPage />} />
//           <Route path="/movies/:show_id" element={<MoviesPage />} />
//           <Route path="/policy" element={<PolicyPage />} />
//           <Route path="/category" element={<Category />} />
//           <Route path="/category/:categoryName" element={<CategoryMoviePage />} />
//         </Routes>
//       </Router>
//     </>
//   );
// }

// export default App;
