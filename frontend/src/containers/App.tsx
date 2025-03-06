import React from 'react';
import '../index.scss';
import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';
import Login from './Login';
import {
  getAuthValues,
  isValidToken,
  loginSuccess,
  logout,
  useAuth
} from '../slices/auth';
import Register from './Register';
import Vote from './Vote';
import { useDispatch, useSelector } from '../store/hooks';
import Admin from './Admin';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedIn = useSelector((state) => state.auth.token !== '');

  const LogoutEffect = () => {
    localStorage.removeItem('jwt');
    dispatch(logout());
    navigate('/login');
  };

  React.useLayoutEffect(() => {
    const { token, processed } = getAuthValues();
    if (isValidToken(processed.exp)) {
      dispatch(
        loginSuccess({
          token
        })
      );
    } else {
      LogoutEffect();
      return;
    }
  }, []);

  return (
    <div id='app'>
      <h1 className='title is-1 has-text-centered'>Voting Platform</h1>
      {loggedIn && (
        <button
          className='button is-danger'
          onClick={LogoutEffect}
          style={{ position: 'absolute', top: 20, right: 20 }}
        >
          Logout
        </button>
      )}
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route path='/' element={<Vote />} />
          <Route element={<AdminRoute />}>
            <Route path='/admin' element={<Admin />} />
          </Route>
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

const AdminRoute = () => {
  const location = useLocation();
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [checking, setChecking] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (!checking && !auth.isAdmin) {
      navigate('/', { replace: true, state: { from: location } });
    }
  }, [auth, checking]);

  React.useEffect(() => {
    setChecking(false);
  }, [auth]);

  return <Outlet />;
};

export default App;
