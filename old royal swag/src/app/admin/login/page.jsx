"use client";
import React, { useState } from 'react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Use an API route or server action to set the HTTP-only cookie in a real app,
    // but for simplicity client-side cookies can be set here since the middleware reads it.
    document.cookie = `rs_admin_auth=${password}; path=/`;
    // We will verify server-side on next request
    window.location.href = '/admin';
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0A1A0A', display: 'flex', 
      alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{
        background: '#1A2A1A', padding: 40, borderRadius: 16, 
        width: '100%', maxWidth: 400, border: '1px solid #49573850'
      }}>
        <h1 style={{ color: '#F4EDD6', marginBottom: 24, textAlign: 'center' }}>Admin Login</h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            type="password"
            placeholder="Enter Admin Secret"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: 16, borderRadius: 8, border: '1px solid #495738', 
              background: '#0A1A0A', color: '#F4EDD6', fontSize: 16
            }}
          />
          {error && <p style={{ color: '#E24B4A', fontSize: 14 }}>{error}</p>}
          <button 
            type="submit" 
            style={{
              background: '#9A6F1A', color: '#F4EDD6', padding: 16, 
              borderRadius: 8, border: 'none', fontWeight: 'bold', fontSize: 16, cursor: 'pointer'
            }}
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
