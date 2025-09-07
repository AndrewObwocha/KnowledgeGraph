import { useState } from 'react';
import '../styles/AuthForm.css';

function AuthForm({ method, route }) {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const methodName = method === 'login' ? 'Login' : 'Register';

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    
    try {
      console.log('Form submitted:', { username, password });
    } catch (error) {
      console.error('Error submitting form:', error);
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