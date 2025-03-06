import { useDispatch } from '../store/hooks';
import { useRegisterMutation } from '../api';
import React from 'react';
import { loginSuccess } from '../slices/auth';
import { Link, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [idBytes, setIdBytes] = React.useState<File>();
  const [state, setState] = React.useState<string>('AL');
  const [error, setError] = React.useState<string>('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [registerMutation] = useRegisterMutation();

  // Just using the name of the file here to not worry about actually storing the file
  const register = async () => {
    await registerMutation({
      username,
      password,
      idBytes: idBytes?.name ?? '',
      state
    })
      .unwrap()
      .then((data) => {
        dispatch(
          loginSuccess({
            token: data.token
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
        <h5 className='title is-5'>Register</h5>
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
          <label className='label'>ID Picture</label>
          <div className='control'>
            <input
              className='input'
              type='file'
              onChange={(e) => setIdBytes(e.target.files?.[0])}
            />
          </div>
        </div>
        <div className='field'>
          <label className='label'>State</label>
          <div className='control'>
            <div className='select'>
              <select value={state} onChange={(e) => setState(e.target.value)}>
                <option value='AL'>Alabama</option>
                <option value='AK'>Alaska</option>
                <option value='AZ'>Arizona</option>
                <option value='AR'>Arkansas</option>
                <option value='CA'>California</option>
                <option value='CO'>Colorado</option>
                <option value='CT'>Connecticut</option>
                <option value='DE'>Delaware</option>
                <option value='FL'>Florida</option>
                <option value='GA'>Georgia</option>
                <option value='HI'>Hawaii</option>
                <option value='ID'>Idaho</option>
                <option value='IL'>Illinois</option>
                <option value='IN'>Indiana</option>
                <option value='IA'>Iowa</option>
                <option value='KS'>Kansas</option>
                <option value='KY'>Kentucky</option>
                <option value='LA'>Louisiana</option>
                <option value='ME'>Maine</option>
                <option value='MD'>Maryland</option>
                <option value='MA'>Massachusetts</option>
                <option value='MI'>Michigan</option>
                <option value='MN'>Minnesota</option>
                <option value='MS'>Mississippi</option>
                <option value='MO'>Missouri</option>
                <option value='MT'>Montana</option>
                <option value='NE'>Nebraska</option>
                <option value='NV'>Nevada</option>
                <option value='NH'>New Hampshire</option>
                <option value='NJ'>New Jersey</option>
                <option value='NM'>New Mexico</option>
                <option value='NY'>New York</option>
                <option value='NC'>North Carolina</option>
                <option value='ND'>North Dakota</option>
                <option value='OH'>Ohio</option>
                <option value='OK'>Oklahoma</option>
                <option value='OR'>Oregon</option>
                <option value='PA'>Pennsylvania</option>
                <option value='RI'>Rhode Island</option>
                <option value='SC'>South Carolina</option>
                <option value='SD'>South Dakota</option>
                <option value='TN'>Tennessee</option>
                <option value='TX'>Texas</option>
                <option value='UT'>Utah</option>
                <option value='VT'>Vermont</option>
                <option value='VA'>Virginia</option>
                <option value='WA'>Washington</option>
                <option value='WV'>West Virginia</option>
                <option value='WI'>Wisconsin</option>
                <option value='WY'>Wyoming</option>
              </select>
            </div>
          </div>
        </div>
        <div className='field'>
          <div className='control'>
            <button className='button is-primary' onClick={register}>
              Register
            </button>
          </div>
        </div>
        {error && <div className='notification is-danger'>{error}</div>}
        <hr />
        <div className='field'>
          <div className='control'>
            <Link className='button is-link' to='/login'>
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
