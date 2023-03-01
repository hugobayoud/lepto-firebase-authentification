import { db } from '../firebase';
import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuthState } from '../context/AuthContext';

const Account = () => {
  // Come from context/AuthContext.js
  const {
    user,
    updateUserInfo,
    updateUserEmail,
    changeUserPassword,
    reAuthenticateUser,
    sendUserEmailVerification,
  } = useAuthState();

  const [age, setAge] = useState(null);
  const [error, setError] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [userDetails, setUserDetails] = useState({});
  const [newPassword, setNewPassword] = useState('');
  const [passwordReAuthenticate, setPasswordReAuthenticate] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');

  /**
   * Get user firstname, lastname and age
   * Use a snapshot to update display in real time when field's values change.
   */
  useEffect(() => {
    // Reference to the document in firebase db (called 'database firestore')
    const ref = doc(db, 'users', `${user?.uid}`);
    const setUserDetailsFunc = (doc) =>
      setUserDetails(() => ({
        firstname: doc.data()?.firstname,
        lastname: doc.data()?.lastname,
        age: doc.data()?.age,
      }));
    onSnapshot(ref, setUserDetailsFunc);
  }, [user?.uid]);

  /**
   * Handle submit form:
   * Update user firstname, lastname and age
   */
  const handleSubmitUserInfo = async (e) => {
    e.preventDefault();

    try {
      await updateUserInfo(user.uid, { firstname, lastname, age });
    } catch (error) {
      setError(error.message);
    }
  };

  /**
   * Handle submit form:
   * 1. Re-authenticate user
   * 2. Update its email
   * 3. Send email verification
   */
  const handleReAuthenticateAndUpdateEmail = async (e) => {
    e.preventDefault();

    // 1. Re-authenticate user
    reAuthenticateUser(passwordReAuthenticate)
      .then(() => {
        // 2. If success, update email
        updateUserEmail(newEmail)
          .then(() => {
            // 3. If success, send email verification process
            sendUserEmailVerification()
              .then()
              .catch((error) => {
                console.warn('Send email verification failed!');
                setError(error.message);
              });
          })
          .catch((error) => {
            console.warn('Updating email failed!');
            setError(error.message);
          });
      })
      .catch((error) => {
        console.warn(`Error while re-authenticate user: ${error.message}`);
        setError(error.message);
      });
  };

  /**
   * Handle submit form:
   * 1. Re-authenticate user
   * 2. Change the user password
   */
  const handleReAuthenticateAndChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== newPasswordConfirmation) {
      setError(
        'The new password and its confirmation are not the same. Boloss !'
      );
      return;
    }

    // 1. Re-authenticate user
    reAuthenticateUser(passwordReAuthenticate)
      .then(() => {
        // 2. If success, change password
        changeUserPassword(newPassword)
          .then(() => {
            console.log('Changing user password was a success!');
          })
          .catch((error) => {
            console.warn('Changing user password failed!');
            setError(error.message);
          });
      })
      .catch((error) => {
        console.warn(`Error while re-authenticate user: ${error.message}`);
        setError(error.message);
      });
  };

  return (
    <>
      <h2>This is a private route</h2>
      {error ? <p style={{ color: 'red' }}>{error}</p> : null}

      {/* USER DETAILS */}

      {JSON.stringify(user)}

      <ul>
        <li id="0">uid = {user?.uid}</li>
        <li id="1">email = {user?.email}</li>
        <li id="2">email vérifié = {user?.emailVerified ? `OUI` : `NON`}</li>
        <li id="3">
          firstname = {userDetails?.firstname ?? 'no fistname added'}
        </li>
        <li id="4">
          lastname = {userDetails?.lastname ?? 'no lastname added'}
        </li>
        <li id="5">age = {userDetails?.age ?? 'no age added'}</li>
      </ul>

      <hr />

      {/* UPDATE USER FIRSTNAME, LASTNAME, AGE */}

      <h2>Update user firstname, lastname, age</h2>

      <form onSubmit={handleSubmitUserInfo}>
        <label>
          firstname:
          <input
            placeholder="firstname"
            onChange={(e) => setFirstname(e.target.value)}
          />
        </label>
        <br />
        <label>
          lastname:
          <input
            placeholder="lastname"
            onChange={(e) => setLastname(e.target.value)}
          />
        </label>
        <br />
        <label>
          age:
          <input
            placeholder="age"
            type="number"
            onChange={(e) => setAge(e.target.value)}
          />
        </label>
        <button>Update info now!</button>
      </form>

      <hr />

      {/* UPDATE USER EMAIL */}

      <h2>Update Email</h2>

      <p>note: refresh the page to see your new email</p>

      <form onSubmit={handleReAuthenticateAndUpdateEmail}>
        <label>
          new email:
          <input
            placeholder="email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          password for re-authentification:
          <input
            placeholder="password for re-authentification"
            type="password"
            value={passwordReAuthenticate}
            onChange={(e) => setPasswordReAuthenticate(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Update email now!</button>
      </form>

      <hr />

      {/* CHANGE USER PASSWORD */}

      <h2>Change password</h2>

      <form onSubmit={handleReAuthenticateAndChangePassword}>
        <label>
          new password:
          <input
            placeholder="new password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <br />

        <label>
          confirm new password:
          <input
            placeholder="confirm new password"
            type="password"
            value={newPasswordConfirmation}
            onChange={(e) => setNewPasswordConfirmation(e.target.value)}
          />
        </label>
        <br />

        <label>
          old password for re-authentification:
          <input
            placeholder="old password for re-authentification"
            type="password"
            value={passwordReAuthenticate}
            onChange={(e) => setPasswordReAuthenticate(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Change password now!</button>
      </form>
    </>
  );
};

export default Account;
