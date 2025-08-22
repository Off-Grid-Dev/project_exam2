import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { LoginRegister } from './pages/LoginRegister';
import { Wrapper } from './components/layout/Wrapper';

function App() {
  return (
    <BrowserRouter basename='/project_exam2'>
      <Wrapper>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/welcome' element={<LoginRegister />} />
          <Route path='*' element={<Home />} />
        </Routes>
      </Wrapper>
    </BrowserRouter>
  );
}

export default App;
