import React, { useState } from 'react';
import '../App.css';

export default function Signup({ onBack, onSignup }) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        if (!email || !password || !name) {
            setError('Please complete all fields');
            return;
        }

        // Placeholder: call signup API
        onSignup({ email, name });
    };

    return (
        <div className="auth-shell">
            <div className="auth-card">
                <button className="ghost-button back-button" onClick={onBack}>← Back</button>
                <h2>Create account</h2>
                <p className="muted">Sign up to manage bookings and save your details.</p>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <label className="input-label">Full name</label>
                    <input className="input-control" value={name} onChange={(e) => setName(e.target.value)} />

                    <label className="input-label">Email</label>
                    <input className="input-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                    <label className="input-label">Password</label>
                    <input className="input-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                    {error && <div className="form-error">{error}</div>}

                    <div className="auth-actions-row">
                        <button type="submit" className="primary-button">Create account</button>
                        <button type="button" className="ghost-button" onClick={onBack}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
