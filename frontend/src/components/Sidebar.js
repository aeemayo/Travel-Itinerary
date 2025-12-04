import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { LayoutDashboard, Compass, User, Lightbulb } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const { user } = useUser();

    if (!user) return null;

    return (
        <aside className="sidebar">
            <div className="profile-section">
                <div className="avatar">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: '#2A9D8F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <User size={24} />
                        </div>
                    )}
                </div>
            </div>

            <nav className="nav-menu">
                <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <LayoutDashboard size={24} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/tips" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <Lightbulb size={24} />
                    <span>Tips</span>
                </NavLink>

                <NavLink to="/explore" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <Compass size={24} />
                    <span>Explore</span>
                </NavLink>

                <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <User size={24} />
                    <span>Profile</span>
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;
