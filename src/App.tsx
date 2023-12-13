import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Fractals } from './screens/Fractals';
import { Colors } from './screens/Colors';
import Transform from './screens/Transform/Transform';
import { ShapeProvider } from './context/ShapeContext';
import Tests from './screens/Tests/Tests';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Fractals/>} />
          <Route path="/colors" element={<Colors/>} />
          <Route path="/transformations" element={<ShapeProvider><Transform/></ShapeProvider>} />
          <Route path="/tests" element={<Tests/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
