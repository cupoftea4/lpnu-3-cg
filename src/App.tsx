import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Fractals } from './screens/Fractals';
import { Colors } from './screens/Colors';
import Transform from './screens/Transform/Transform';
import { ShapeProvider } from './context/RectangleContext';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Fractals/>} />
          <Route path="/colors" element={<Colors/>} />
          <Route path="/transformations" element={<ShapeProvider><Transform/></ShapeProvider>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
