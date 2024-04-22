import { HashRouter as Router } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ClerkProvider } from '@clerk/clerk-react'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.jsx'

import './index.css'

let PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <Router>
          <App />
        </Router>
      </ClerkProvider>
    </GoogleOAuthProvider>
  </>,
)
