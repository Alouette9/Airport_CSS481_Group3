import './App.css'
import { About } from './about';
import {Routes, BrowserRouter as Router, Route, Link} from 'react-router-dom';
import { AirportTables } from './AirportTables';
import { AirportHome } from './AirportHome';
function App() {


  return (
    <>
    <Router>
      <ul className="nav">
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/tables'>Tables</Link></li>
        <li><Link to='/about'>About</Link></li>
      </ul>
        <Routes>
          <Route exact path="/" element={<AirportHome/>}/>
          <Route exact path="/tables" element={<AirportTables/>}/>
          <Route exact path="/about" element={<About/>}/>
        </Routes>
    </Router>
  </>
  )
}

export default App
