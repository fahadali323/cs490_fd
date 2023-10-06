import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route }
    from 'react-router-dom';
import Home from './pages/home';
import Customers from './pages/customers';
import Report from './pages/report';
import Movies from './pages/movies';
 
function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path='/home' element={<Home />} />
                <Route path='/movies' element={<Movies />} />
                <Route path='/customers' element={<Customers />} />
                <Route path='/report' element={<Report/>} />
            </Routes>
        </Router>
    );
}
 
export default App;