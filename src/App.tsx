import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { LoginRegister } from './pages/LoginRegister';
import { Wrapper } from './components/layout/Wrapper';
import { AuthProvider, useAuth } from './api/AuthContext';

const AppRoutes = () => {
  const { isLoggedIn } = useAuth();
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route
        path='/welcome'
        element={!isLoggedIn ? <LoginRegister /> : <Home />}
      />
      <Route path='*' element={<Home />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter basename='/project_exam2'>
      <AuthProvider>
        <Wrapper>
          <AppRoutes />
        </Wrapper>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
