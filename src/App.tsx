import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { LoginRegister } from './pages/LoginRegister';
import { Header } from './components/layout/Header';
import { AuthProvider } from './api/auth/AuthProvider';
import { useAuth } from './api/auth/useAuth';

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
      <Route path='*' element={<Home />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter basename='/project_exam2'>
      <AuthProvider>
        <Header />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
