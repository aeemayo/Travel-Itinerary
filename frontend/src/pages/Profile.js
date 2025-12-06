import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { User, Mail, Settings, LogOut } from 'lucide-react';
import './Dashboard.css';

const Profile = () => {
  const { user, logout, updateProfile } = useUser();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large. Please choose an image under 2MB.");
        return;
      }

      try {
        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('email', user.email); // Send email to backend

        const response = await fetch('http://localhost:5000/api/user/upload-avatar', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          updateProfile({ avatar: data.avatar_url });
        } else {
          alert(data.error || 'Failed to upload image');
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image. Please try again.');
      }
    }
  };

  const handleSaveName = async () => {
    if (!nameValue.trim()) {
      alert('Name cannot be empty');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('http://localhost:5000/api/user/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: nameValue
        })
      });

      const data = await response.json();

      if (data.success) {
        updateProfile({ name: nameValue });
        setEditingName(false);
      } else {
        alert(data.error || 'Failed to update name');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update name. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

    if (!user) return null;

    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <div className="create-banner" style={{ background: '#FFFFFF' }}>
            <div className="create-icon">
              <User size={32} color="#1E4D3A" />
            </div>
            <div className="create-text">
              <h2 style={{ color: '#0F2920' }}>My Profile</h2>
              <p style={{ color: '#547A68' }}>Manage your account and preferences.</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="upcoming-trip" style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
              <div onClick={handleAvatarClick} style={{ cursor: 'pointer', position: 'relative' }} title="Click to change avatar">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept="image/*"
                />
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#2A9D8F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <User size={50} />
                  </div>
                )}
                <div style={{
                  position: 'absolute', bottom: '0', right: '0',
                  background: 'white', borderRadius: '50%', padding: '5px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}>
                  <Settings size={16} color="#666" />
                </div>
              </div>
              <div>
                {editingName ? (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        fontSize: '1.5rem',
                        fontWeight: '600'
                      }}
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={saving}
                      style={{
                        padding: '8px 16px',
                        background: saving ? '#ccc' : '#2A9D8F',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingName(false);
                        setNameValue(user.name || '');
                      }}
                      style={{
                        padding: '8px 16px',
                        background: 'none',
                        color: '#666',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#264653' }}>{user.name || 'Set your name'}</h2>
                    <button
                      onClick={() => setEditingName(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2A9D8F',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        textDecoration: 'underline'
                      }}
                    >
                      Edit
                    </button>
                  </div>
                )}
                <p style={{ margin: '5px 0 0 0', color: '#666' }}>Travel Enthusiast</p>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '12px' }}>
                <Mail size={20} color="#2A9D8F" />
                <div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#888' }}>Email</p>
                  <p style={{ margin: 0, fontWeight: '500' }}>{user.email}</p>
                </div>
              </div>


            </div>

            <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>

              <button onClick={handleLogout} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                width: '100%', padding: '15px', border: 'none', background: 'none',
                textAlign: 'left', cursor: 'pointer', fontSize: '1rem', color: '#E76F51'
              }}>
                <LogOut size={20} /> Sign Out
              </button>
            </div>
          </div>

          {/* <div className="recent-itineraries">
            <h3>Travel Stats</h3>
            <div className="recent-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="recent-card" style={{ textAlign: 'center', padding: '30px' }}>
                <h2 style={{ fontSize: '2.5rem', color: '#2A9D8F', margin: 0 }}>{user.countries || 0}</h2>
                <p style={{ color: '#666' }}>Countries Visited</p>
              </div>
              <div className="recent-card" style={{ textAlign: 'center', padding: '30px' }}>
                <h2 style={{ fontSize: '2.5rem', color: '#E9C46A', margin: 0 }}>{user.cities || 0}</h2>
                <p style={{ color: '#666' }}>Cities Explored</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    );
  };

  export default Profile;
