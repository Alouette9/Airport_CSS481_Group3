import './App.css'
import { About } from './About';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { AirportTables } from './AirportTables';
import { AirportHome } from './AirportHome';
import { useRef, useState, useCallback } from 'react';
import FlightTransition from './FlightTransition';

export default function App({jsonSample, databaseRef, dataChanged, setDataChanged}) {

    const navigate = useNavigate();
    const [playing, setPlaying] = useState(false);

    const flyTo = useCallback((e, path) => {
        e.preventDefault();
        if (playing) return;
        setPlaying(true);

        const DURATION = 900;
        setTimeout(() => {
            navigate(path);
            setTimeout(() => setPlaying(false), 300);
        }, DURATION);
    }, [navigate, playing]);

    const navClass = ({ isActive }) => (isActive ? 'active' : undefined);

    return (
        <>
            <ul className="nav">
                <li><NavLink to="/" end className={navClass} onClick={(e) => {flyTo(e, '/')}}>Home</NavLink></li>
                <li><NavLink to="/tables" className={navClass} onClick={(e) => {flyTo(e, '/tables')}}>Tables</NavLink></li>
                <li><NavLink to="/about" className={navClass} onClick={(e) => flyTo(e, '/about')}>About</NavLink></li>
            </ul>

            <Routes>
                <Route path="/" element={<AirportHome jsonSample={jsonSample} dataChanged={dataChanged} setDataChanged={setDataChanged}/>} />
                <Route path="/tables" element={<AirportTables jsonSample={jsonSample} dataChanged={dataChanged} setDataChanged={setDataChanged}/>} />
                <Route path="/about" element={<About />} />
            </Routes>

            <FlightTransition playing={playing} />
        </>
    )
}

