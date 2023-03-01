import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();

  const { signUp } = useAuthState();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Handle submit form:
   * Sign up a new user to firebase
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signUp(email, password);
      navigate('/');
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <h2>Sign Up</h2>

      <form onSubmit={handleSubmit}>
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
        <button>Sign Up</button>
      </form>
    </>
  );
};
export default Signup;
