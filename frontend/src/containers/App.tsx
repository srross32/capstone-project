import React from 'react';
import "../index.scss";
import { Route, Routes } from 'react-router-dom';
import Login from './Login';

const App: React.FC = () => {
    return <div id="app">
        <h1 className="title is-1 has-text-centered">Voting Platform</h1>
        <Routes>
            <Route path="/login" element={<Login />} />
        </Routes>
    </div>
}

export default App;