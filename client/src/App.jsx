import './App.css'
import DataAdmin from './DataAdmin';
import { About } from './About';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { AirportTables } from './AirportTables';
import { AirportHome } from './AirportHome';
import { useRef, useState, useCallback, useLayoutEffect } from 'react';
import FlightTransition from './FlightTransition';
import ChatBox from "./ChatBox";


export default function App({jsonSample, databaseRef, dataChanged, setDataChanged, docIDs}) {

    const carrierMap = useRef(new Map());
    const airportMap = useRef(new Map());
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
                <li><NavLink to="/admin" className={navClass} onClick={(e) => flyTo(e, '/admin')}>Admin</NavLink></li>
            </ul>

            <Routes>
                <Route path="/" element={<AirportHome jsonSample={jsonSample} dataChanged={dataChanged} setDataChanged={setDataChanged} carrierMap={carrierMap} airportMap={airportMap}/>} />
                <Route path="/tables" element={<AirportTables jsonSample={jsonSample} dataChanged={dataChanged} setDataChanged={setDataChanged}/>} />
                <Route path="/about" element={<About />} />
                <Route path="/admin" element={<DataAdmin jsonSample={jsonSample} databaseRef={databaseRef} docIDs={docIDs} carrierMap={carrierMap} airportMap={airportMap} 
                dataChanged={dataChanged} setDataChanged={setDataChanged}/>} />
            </Routes>

            <FlightTransition playing={playing} />
            <ChatBox />
        </>
    )
}

