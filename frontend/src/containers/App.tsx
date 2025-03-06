import React from 'react';
import '../index.scss';
import { Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Login from './Login';
import { useAuth } from '../slices/auth';
import Register from './Register';
import Vote from './Vote';

const App: React.FC = () => {
  return (
    <div id='app'>
      <h1 className='title is-1 has-text-centered'>Voting Platform</h1>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route element={<PrivateRoute />}>
            <Route path="/" element={<Vote/>} />
        </Route>
      </Routes>
    </div>
  );
};

const PrivateRoute = () => {
    const location = useLocation();
    const { loggedIn, checking } = useAuth();
    const navigate = useNavigate();
  
    React.useEffect(() => {
      if (!checking && !loggedIn) {
        localStorage.removeItem('jwt');
        navigate('/login', { replace: true, state: { from: location } });
      }
    }, [loggedIn, checking]);
  
    return <Outlet />;
  };
  

export default App;
