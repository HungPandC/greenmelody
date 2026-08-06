import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import './index.css'
import "./style/Auth.css"
import App from './App.tsx'
import AuthProvider from './context/AuthProvider.tsx'

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="93291837825-aq7j7ag5nnvef7mh5t9876r879m9s73a.apps.googleusercontent.com">
    <AuthProvider>
      <App />
    </AuthProvider>
  </GoogleOAuthProvider>
);
