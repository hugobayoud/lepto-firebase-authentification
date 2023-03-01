import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logOut } = useAuthState();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ background: '#00f6a2' }}>
      <Link to="/">
        <h1>LEPTO</h1>
      </Link>
      {isAuthenticated ? (
        <div>
          <Link to="/account">
            <button>Account</button>
          </Link>
          <Link to="/events">
            <button>Events</button>
          </Link>
          <button onClick={handleLogout} style={{ color: 'red' }}>
            X Log out
          </button>
        </div>
      ) : (
        <div>
          <Link to="/login">
            <button>Log In</button>
          </Link>
          <Link to="/signup">
            <button>Sign Up</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
