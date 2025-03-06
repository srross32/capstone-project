import { useDispatch, useSelector } from '../store/hooks';
import { useLoginMutation } from '../api';
import React from 'react';
import { loginSuccess } from '../slices/auth';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const [loginMutation] = useLoginMutation();

  React.useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  const login = async () => {
    await loginMutation({ username, password })
      .unwrap()
      .then((res) => {
        dispatch(
          loginSuccess({
            token: res.token
          })
        );
        navigate('/');
      })
      .catch((err) => {
        setError(err.data.error);
      });
  };

  return (
    <div id='login'>
      <div className='box'>
        <h5 className='title is-5'>Login</h5>
        <hr />
        <div className='field'>
          <label className='label'>Username</label>
          <div className='control'>
            <input
              className='input'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <div className='field'>
          <label className='label'>Password</label>
          <div className='control'>
            <input
              className='input'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className='field'>
          <div className='control'>
            <button className='button is-primary' onClick={login}>
              Login
            </button>
          </div>
        </div>
        {error && <div className='notification is-danger'>{error}</div>}
        <hr />
        <div className='field'>
          <div className='control'>
            <Link className='button is-link' to='/register'>
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
