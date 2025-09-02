import '../styles/AuthForm.css';

function AuthForm({ useCase }) {
  return (
    <form className='auth-form'>
      <h1>{ useCase }</h1>
      <div className='input-group'>
        <label htmlFor="username">Username: </label>
        <input type="text" id="username" name="username" required />
      </div>
      <div className='input-group'>
        <label htmlFor="password">Password: </label>
        <input type="password" id="password" name="password" required />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default AuthForm;