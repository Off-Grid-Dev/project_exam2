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
import ContextProvider from './context/ContextProvider';

const AppRoutes = () => {
  const { isLoggedIn } = useAuth();
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/venues/:id' element={<Venue />} />
      <Route
        path='/welcome'
        element={!isLoggedIn ? <LoginRegister /> : <Home />}
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
      <Route path='*' element={<Home />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter basename='/project_exam2'>
      <ContextProvider>
        <Header />
        <AppRoutes />
      </ContextProvider>
    </BrowserRouter>
  );
}

export default App;
