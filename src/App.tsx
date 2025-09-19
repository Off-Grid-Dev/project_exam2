import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { LoginRegister } from './pages/LoginRegister';
import { Header } from './components/layout/Header';
import { useAuth } from './context/auth/useAuth';
import ContextProvider from './context/ContextProvider';
import Venue from './pages/Venue';

const AppRoutes = () => {
  const { isLoggedIn } = useAuth();
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route
        path='/welcome'
        element={!isLoggedIn ? <LoginRegister /> : <Home />}
      />
      {/* <Route path='/profile' element={!isLoggedIn ? <Profile /> : <Home />} /> */}
      <Route path='/venues/:id' element={<Venue />} />
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
