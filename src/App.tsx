import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Fractals } from './screens/Fractals';
import { Colors } from './screens/Colors';
import Transform from './screens/Transform/Transform';
import { ShapeProvider } from './context/ShapeContext';
import Tests from './screens/Tests/Tests';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';
import { fractals_parts } from './utils/theory/fractals';
import TheoryModal from './components/TheoryModal/TheoryModal';
import { TheoryPart } from './types';
import { colors_parts } from './utils/theory/colors';
import { transformations_parts } from './utils/theory/transformations';
import 'react-toastify/dist/ReactToastify.css';
import { useAchievements } from './context/AchievementsContext';

export type TheoryType = 'fractals' | 'colors' | 'transformations'; 

function App() {
  const [isTheoryModalOpen, setIsTheoryModalOpen] = useState(false);
  const [theory, setTheory] = useState<TheoryPart[]>([]);

  const { notifyAction } = useAchievements();

  const openTheoryModal = (type: TheoryType) => {
    switch (type) {
      case 'fractals':
        notifyAction('fractals-theory');
        setTheory(fractals_parts);
        break;
      case 'colors':
        notifyAction('colors-theory');
        setTheory(colors_parts);
        break;
      case 'transformations':
        notifyAction('transformations-theory');
        setTheory(transformations_parts);
        break;
    }
    setIsTheoryModalOpen(true);
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Fractals onTheoryClick={() => openTheoryModal('fractals')}/>} />
          <Route path="/colors" element={<Colors onTheoryClick={() => openTheoryModal('colors')}/>} />
          <Route path="/transformations" element={
            <ShapeProvider>
              <Transform onTheoryClick={() => openTheoryModal('transformations')}/>
            </ShapeProvider>
          } />
          <Route path="/tests" element={<Tests/>} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-center" theme="colored" pauseOnFocusLoss={false} autoClose={5000} limit={2} hideProgressBar
      />
      {
        isTheoryModalOpen &&
        <TheoryModal theory={theory} onClose={() => setIsTheoryModalOpen(false)} />
      }
    </>
  )
}

export default App
