import { createRoot } from 'react-dom/client';
import App from './components/App';

// import style
import './styles/style.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container #root tidak ditemukan di index.html');
}

createRoot(container).render(<App />);
