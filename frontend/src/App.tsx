import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import PolicyPage from './pages/PolicyPage';
import Category from './pages/CategoryPage.tsx';
import CategoryMoviePage from './pages/CategoryMoviePage.tsx';
import SearchResultsPage from './pages/SearchResultsPage.tsx';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem('username');
    if (!userEmail) return;

    async function checkAdmin() {
      try {
        const res = await fetch(
          `https://intex-group2-7-backend-duahbmbxaggha8e2.eastus-01.azurewebsites.net/Role/CheckRoleByEmail/${userEmail}`,
          {
            credentials: 'include',
          }
        );
        const isAdminResponse = await res.text();
        if (isAdminResponse === 'User is an admin ✅') {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
      }
    }

    checkAdmin();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/admin"
          element={isAdmin ? <AdminPage /> : <Navigate to="/home" />}
        />
        <Route path="/policy" element={<PolicyPage />} />
        <Route path="/category" element={<Category />} />
        <Route
          path="/category/:categoryName"
          element={<CategoryMoviePage />}
        />
        <Route path="/search" element={<SearchResultsPage />} />
      </Routes>
    </Router>
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
// import PolicyPage from './pages/PolicyPage';
// import Category from './pages/CategoryPage.tsx';
// import CategoryMoviePage from './pages/CategoryMoviePage.tsx';
// import SearchResultsPage from './pages/SearchResultsPage.tsx';

// function App() {
//   return (
//     <>
//       <Router>
//         <Routes>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/home" element={<HomePage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/admin" element={isAdmin ? <AdminPage /> : <Navigate to="/home" />}
// />

//           <Route path="/policy" element={<PolicyPage />} />
//           <Route path="/category" element={<Category />} />
//           <Route
//             path="/category/:categoryName"
//             element={<CategoryMoviePage />}
//           />
//           <Route path="/search" element={<SearchResultsPage />} />
//         </Routes>
//       </Router>
//     </>
//   );
// }

// export default App;
