import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { LoginRegister } from './pages/LoginRegister';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/welcome' element={<LoginRegister />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
