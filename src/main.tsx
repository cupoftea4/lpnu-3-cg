import ReactDOM from 'react-dom/client'
import './styles/reset.css'
import './variables.css'
import App from './App.tsx'
import { AchievementsProvider } from './context/AchievementsContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <AchievementsProvider>
    <App />
  </AchievementsProvider>
  // </React.StrictMode>,
)
