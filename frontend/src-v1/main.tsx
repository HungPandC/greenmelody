import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import './index.css'
import "./style/auth.css"
import "./style/app.css"
import App from './App.tsx'
import AuthProvider from './context/AuthProvider.tsx'

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </GoogleOAuthProvider>
);
