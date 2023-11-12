import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Fractals } from './screens/Fractals';
import { Colors } from './screens/Colors';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Fractals/>} />
          <Route path="/colors" element={<Colors/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
