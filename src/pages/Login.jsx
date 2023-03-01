import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();

  const { logIn, sendUserPasswordResetEmail } = useAuthState();

  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Handle submit form:
   * Log in the user
   */
  const handleSubmitLogIn = async (e) => {
    e.preventDefault();

    try {
      await logIn(email, password);
      navigate('/account');
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  /**
   * Handle submit form:
   * Password reset when password forgotten
   * Ask the user to give its email first
   */
  const handlePasswordReset = () => {
    // if email field not fill, ask the user to fill it
    if (!email) {
      setError('Please, set your valid email first');
      return;
    }

    // then, send reset password email
    sendUserPasswordResetEmail(email)
      .then(() => {
        setError(null);
        // if success, notify the user
        setSuccess('Reset password email sent!');
      })
      .catch((error) => {
        console.warn(error);
        setError(error.message);
      });
  };

  return (
    <>
      <h2>Log In</h2>
      {error ? <p style={{ color: 'red' }}>{error}</p> : null}
      {success ? <p style={{ color: 'green' }}>{success}</p> : null}

      <form onSubmit={handleSubmitLogIn}>
        <label>
          email:
          <input
            placeholder="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          password:
          <input
            placeholder="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button>Log In!</button>
      </form>

      {/* PASSWORD FORGOTTEN */}

      <button onClick={handlePasswordReset}>forgot password?</button>
    </>
  );
};
export default Login;
