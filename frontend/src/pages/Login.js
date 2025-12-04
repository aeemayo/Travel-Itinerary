import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { LogIn, User, Mail, Lock, CheckCircle } from 'lucide-react';
import './Dashboard.css';

const Login = () => {
  const [step, setStep] = useState(1); // 1: Details, 2: Verification
  const [formData, setFormData] = useState({
    email: ''
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        if (data.dev_code) {
          alert(`Development Mode: Your code is ${data.dev_code}`);
        }
        setStep(2);
      } else {
        setError(data.error || 'Failed to send code');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode
        })
      });

      const data = await response.json();

      if (data.success) {
        // Use user profile data from backend
        const userProfile = data.user || {
          email: formData.email,
          name: '',
          avatar: ''
        };
        userProfile.id = Date.now();
        userProfile.joinedDate = new Date().toLocaleDateString();
        
        login(userProfile);
        navigate('/');
      } else {
        setError(data.error || 'Invalid code');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
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
            width: '60px', height: '60px', background: step === 2 ? '#2A9D8F' : '#457B9D',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 15px'
          }}>
            {step === 1 ? <LogIn color="white" size={30} /> : <CheckCircle color="white" size={30} />}
          </div>
          <h2 style={{ margin: 0, color: '#264653' }}>{step === 1 ? 'Welcome Back' : 'Verify Your Email'}</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>
            {step === 1 ? 'Enter your email to receive a login code' : `Code sent to ${formData.email}`}
          </p>
        </div>

        {error && (
          <div style={{ padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {message && step === 2 && (
          <div style={{ padding: '10px', background: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
            {message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

          <button type="submit" disabled={loading} style={{
            background: loading ? '#ccc' : '#2A9D8F', color: 'white', border: 'none',
            padding: '15px', borderRadius: '10px', fontSize: '1rem',
            fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px',
            transition: 'background 0.2s'
          }}>
            {loading ? 'Sending...' : 'Send Login Code'}
          </button>
        </form>
        ) : (
        <form onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Lock size={20} color="#aaa" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Enter 6-digit code"
              required
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              style={{
                width: '100%', padding: '12px 12px 12px 45px',
                borderRadius: '10px', border: '1px solid #ddd',
                fontSize: '1rem', letterSpacing: '0.3em', textAlign: 'center'
              }}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            background: loading ? '#ccc' : '#2A9D8F', color: 'white', border: 'none',
            padding: '15px', borderRadius: '10px', fontSize: '1rem',
            fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s'
          }}>
            {loading ? 'Verifying...' : 'Verify & Login'}
          </button>

          <button type="button" onClick={() => setStep(1)} style={{
            background: 'none', color: '#666', border: 'none',
            padding: '10px', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline'
          }}>
            Change Email
          </button>
        </form>
        )}
      </div>
    </div>
  );
};

export default Login;
