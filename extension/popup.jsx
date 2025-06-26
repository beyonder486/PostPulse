// popup.js (with token fix and cleanup)

import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';

export default function Popup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        chrome.storage.local.set({ supabase_token: session.access_token });
        setLoggedIn(true);
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        chrome.storage.local.set({ supabase_token: session.access_token });
        setLoggedIn(true);
      }
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError(error.message);
    } else {
      chrome.storage.local.set({ supabase_token: data.session.access_token });
      setLoggedIn(true);
    }
  };

  const handleGoogleLogin = async () => {
    const redirectUrl = chrome.identity.getRedirectURL();
    const providerUrl = `https://kkjhrmjocfkdxylgzthl.supabase.co/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUrl)}`;
    
    console.log("providerUrl", providerUrl);
    chrome.identity.launchWebAuthFlow(
      {
        url: providerUrl,
        interactive: true,
      },
      async (redirectResponse) => {
        // Add this line to log the full redirect response
        console.log("redirectResponse", redirectResponse);

        if (chrome.runtime.lastError || !redirectResponse) {
          console.error("Google login failed:", chrome.runtime.lastError, redirectResponse);
          setLoginError("Google login failed.");
          return;
        }
        const url = new URL(redirectResponse);
        const hash = url.hash.substring(1); // Remove the leading '#'
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');

        if (accessToken) {
          chrome.storage.local.set({ supabase_token: accessToken });
          setLoggedIn(true);
        } else {
          setLoginError("No access token found in redirect.");
        }
      }
    );
  };

  const sendTestMetrics = async () => {
    chrome.storage.local.get('supabase_token', async ({ supabase_token }) => {
      if (!supabase_token) {
        alert('No user token found!');
        return;
      }
      const res = await fetch('http://localhost:3000/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metrics: [
            {
              post_url: 'https://linkedin.com/posts/example',
              likes: 123,
              comments: 45,
              views: 6789
            }
          ],
          user_token: supabase_token
        })
      });
      const data = await res.json();
      alert('Sent! Response: ' + JSON.stringify(data));
    });
  };

  const sendActualMetrics = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getMetrics' }, (scrapedMetrics) => {
        console.log('Popup received metrics:', scrapedMetrics); // <-- Add this
        if (!scrapedMetrics || scrapedMetrics.length === 0) {
          alert('No metrics found on this page.');
          return;
        }
        chrome.storage.local.get('supabase_token', async ({ supabase_token }) => {
          if (!supabase_token) {
            alert('No user token found!');
            return;
          }
          const res = await fetch('http://localhost:3000/api/metrics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              metrics: scrapedMetrics,
              user_token: supabase_token
            })
          });
          const data = await res.json();
          alert('Sent! Response: ' + JSON.stringify(data));
        });
      });
    });
  };

  if (!loggedIn) {
    return (
      <div style={{ fontFamily: 'sans-serif', margin: 16, width: 250 }}>
        <h2>Login</h2>
        <button
          style={{
            width: '100%',
            padding: 8,
            background: '#4285F4',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            marginBottom: 8,
            cursor: 'pointer'
          }}
          onClick={handleGoogleLogin}
        >
          Sign in with Google
        </button>
        <div style={{ textAlign: 'center', margin: '8px 0' }}>or</div>
        <form onSubmit={handleLogin}>
          <input
            style={{ width: '100%', marginBottom: 8 }}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            style={{ width: '100%', marginBottom: 8 }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            style={{
              width: '100%',
              padding: 8,
              background: '#0077B5',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              marginBottom: 8,
              cursor: 'pointer'
            }}
            type="submit"
          >
            Login
          </button>
        </form>
        {loginError && <div style={{ color: 'red' }}>{loginError}</div>}
      </div>
    );
  }

  // After login, show your message
  return (
    <div style={{ fontFamily: 'sans-serif', margin: 16, width: 250, textAlign: 'center' }}>
      <h2>You're logged in!</h2>
      <p>
        Please keep scrolling your LinkedIn feed.<br />
        Your data will be fetched automatically.
      </p>
      <button
        style={{
          marginTop: 16,
          padding: 8,
          background: '#ccc',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}
        onClick={async () => {
          await supabase.auth.signOut();
          chrome.storage.local.remove('supabase_token');
          setLoggedIn(false);
        }}
      >
        Log out
      </button>
      <button
        style={{
          marginTop: 8,
          padding: 8,
          background: '#0077B5',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}
        onClick={sendActualMetrics}
      >
        Send Actual Metrics
      </button>
    </div>
  );
}
