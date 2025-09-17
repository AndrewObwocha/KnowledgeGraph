import { useState } from 'react';
import '../styles/AuthForm.css';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { useNavigate } from 'react-router-dom';

function AuthForm({ method, route }) {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const methodName = method === 'login' ? 'Login' : 'Register';

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    
    try {
      const res = await api.post(route, { username, password });

      if (method === 'login' && res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.accessToken);
        localStorage.setItem(REFRESH_TOKEN, res.data.refreshToken);
        navigate('/');
      } else if (method === 'register' && res.status === 200) {
        navigate('/login');
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <>
        <h1 className='form-title'>{ methodName }</h1>
        <form 
            className='auth-form'
            onSubmit={(e) => handleSubmit(e)}
        >
            <input
                className='form-input'
                type='text'
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                placeholder='Username'
                required
            />
            <input
                className='form-input'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
                required
            />
            <button
                className='form-button'
                type='submit'
            >
                { methodName }
            </button>
        </form>
    </>
  );
}

export default AuthForm;