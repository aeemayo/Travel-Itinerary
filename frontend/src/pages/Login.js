import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { LogIn, Mail, Lock, UserPlus } from 'lucide-react';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail 
} from 'firebase/auth';
import './Dashboard.css';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      let userCredential;
      
      if (isSignUp) {
        // Create new account
        userCredential = await createUserWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );
      } else {
        // Sign in existing user
        userCredential = await signInWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );
      }

      const user = userCredential.user;
      
      // Create user profile for our app
      const userProfile = {
        id: user.uid,
        email: user.email,
        name: user.displayName || '',
        avatar: user.photoURL || '',
        joinedDate: new Date().toLocaleDateString()
      };
      
      login(userProfile);
      navigate('/');
      
    } catch (err) {
      console.error('Auth error:', err);
      
      // User-friendly error messages
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Try signing in instead.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email. Try signing up.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/invalid-credential':
          setError('Invalid email or password.');
          break;
        default:
          setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address first.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await sendPasswordResetEmail(auth, formData.email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err) {
      console.error('Reset error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8' }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '60px', height: '60px', background: isSignUp ? '#2A9D8F' : '#457B9D',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 15px'
          }}>
            {isSignUp ? <UserPlus color="white" size={30} /> : <LogIn color="white" size={30} />}
          </div>
          <h2 style={{ margin: 0, color: '#264653' }}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: '#666', marginTop: '5px' }}>
            {isSignUp ? 'Sign up to start planning your trips' : 'Sign in to your account'}
          </p>
        </div>

        {error && (
          <div style={{ padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ padding: '10px', background: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={20} color="#aaa" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%', padding: '12px 12px 12px 45px',
                borderRadius: '10px', border: '1px solid #ddd',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={20} color="#aaa" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="password"
              placeholder="Password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{
                width: '100%', padding: '12px 12px 12px 45px',
                borderRadius: '10px', border: '1px solid #ddd',
                fontSize: '1rem'
              }}
            />
          </div>

          {!isSignUp && (
            <button 
              type="button" 
              onClick={handleForgotPassword}
              style={{
                background: 'none', border: 'none', color: '#457B9D',
                fontSize: '0.9rem', cursor: 'pointer', textAlign: 'right',
                marginTop: '-10px'
              }}
            >
              Forgot Password?
            </button>
          )}

          <button type="submit" disabled={loading} style={{
            background: loading ? '#ccc' : '#2A9D8F', color: 'white', border: 'none',
            padding: '15px', borderRadius: '10px', fontSize: '1rem',
            fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s'
          }}>
            {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span style={{ color: '#666' }}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          </span>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setMessage('');
            }}
            style={{
              background: 'none', border: 'none', color: '#2A9D8F',
              fontWeight: '600', cursor: 'pointer', fontSize: '1rem'
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
