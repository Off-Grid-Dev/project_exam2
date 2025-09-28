// Routing
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import { Home } from './pages/Home';
import { LoginRegister } from './pages/LoginRegister';
import Venue from './pages/Venue';
import MyBookings from './pages/MyBookings';
import ProfilePage from './pages/Profiles';
import ProfileSingle from './pages/Profile';

// Layout/components
import { Header } from './components/layout/Header';

// Context/hooks
import { useAuth } from './context/auth/useAuth';
import { Navigate } from 'react-router-dom';
import { getStoredName } from './api/authToken';
import ContextProvider from './context/ContextProvider';
import Footer from './components/layout/Footer';

const AppRoutes = () => {
  const { isLoggedIn } = useAuth();
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/venues/:id' element={<Venue />} />
      <Route path='/login' element={<LoginRegister initialView={'login'} />} />
      <Route
        path='/register'
        element={<LoginRegister initialView={'register'} />}
      />
      <Route
        path='/profiles'
        element={isLoggedIn ? <ProfilePage /> : <Home />}
      />
      <Route
        path='/profiles/:name'
        element={isLoggedIn ? <ProfileSingle /> : <Home />}
      />
      <Route
        path='/my/bookings'
        element={isLoggedIn ? <MyBookings /> : <Home />}
      />
      {/* helper redirects for venue-related nav links that point to the current user's profile */}
      <Route path='/venues/mine' element={<NavigateToProfile />} />
      <Route path='/venues/mine/bookings' element={<NavigateToProfile />} />
      <Route path='/venues/new' element={<NavigateToProfile />} />
      <Route path='*' element={<Home />} />
    </Routes>
  );
};

const NavigateToProfile = () => {
  const name = getStoredName();
  if (!name) return <Navigate to='/' replace />;
  const encoded = encodeURIComponent(name);
  return <Navigate to={`/profiles/${encoded}`} replace />;
};

function App() {
  return (
    <BrowserRouter basename='/project_exam2'>
      <ContextProvider>
        <Header />
        <AppRoutes />
        <Footer />
      </ContextProvider>
    </BrowserRouter>
  );
}

export default App;
