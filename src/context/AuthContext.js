import {
  signOut,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  reauthenticateWithCredential,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { setDoc, doc, updateDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState({});

  /**
   * Firebase: register a new user using email and password
   */
  function signUp(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((newCredentials) => {
        // If success, initiate the user firstname, lastname and age into db too
        const user = newCredentials?.user;
        if (user?.uid) {
          // store a new document in db
          setDoc(doc(db, 'users', `${user?.uid}`), {
            age: null,
            firstname: null,
            lastname: null,
          });
        }

        // Send email verification
        sendEmailVerification(user)
          .then(() => {
            console.info('Verification email sent!');
          })
          .catch((error) => {
            console.warn(error);
          });
      })
      .catch((error) => {
        console.warn(error);
      });
  }

  /**
   * Firebase: Log in a user
   */
  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  /**
   * Firebase: Log out a user
   */
  function logOut() {
    return signOut(auth);
  }

  /**
   * Firebase : update a document in the db at the node /users/:userId
   * data: {
   *   firstname: string,
   *   lastname: string,
   *   age: number
   * }
   */
  function updateUserInfo(userId, data) {
    updateDoc(doc(db, 'users', userId), data);
  }

  /**
   * Firebase: Update user email
   */
  function updateUserEmail(newEmail) {
    return updateEmail(user, newEmail);
  }

  /**
   * Firebae: Send user an email verification
   * Used when sign up and email update
   */
  function sendUserEmailVerification() {
    return sendEmailVerification(user);
  }

  /**
   * Firebase: Re-authenticate the user before sensitive update like password change, email update.
   * https://firebase.google.com/docs/auth/web/manage-users#re-authenticate_a_user
   */
  function reAuthenticateUser(password) {
    // Get user current credentials
    const credential = EmailAuthProvider.credential(user.email, password);

    // try re-authentifcate the user
    if (credential) {
      return reauthenticateWithCredential(user, credential);
    }

    throw new Error('No credential provided');
  }

  /**
   * Firebase: Change user password
   * Used when the user wants to change its password
   * For password forgot, see bellow
   */
  function changeUserPassword(newPassword) {
    return updatePassword(user, newPassword);
  }

  /**
   * Firebase
   * Used when click on "forgot password?"
   */
  function sendUserPasswordResetEmail(email) {
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        logIn,
        signUp,
        logOut,
        updateUserInfo,
        updateUserEmail,
        reAuthenticateUser,
        changeUserPassword,
        sendUserEmailVerification,
        sendUserPasswordResetEmail,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthState() {
  const auth = useContext(AuthContext);
  return { ...auth, isAuthenticated: auth.user != null };
}
