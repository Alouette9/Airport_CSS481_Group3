import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import FirebaseAccess from './FirebaseAccess.jsx';

createRoot(document.getElementById('root')).render(
    <BrowserRouter basename="/Airport_CSS481_Group3">
        <FirebaseAccess/>
    </BrowserRouter>
)
