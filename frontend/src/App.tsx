import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { useState,useEffect,useContext } from "react";
import AuthPage from "./pages/AuthPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import Home from "./pages/Home";
import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";
import useAuth from "./hooks/useAuth";

function App() {

    const { user, loading } = useAuth()

    return (
        <BrowserRouter>
            <Routes>
                {/* Chỉ dành cho khách (chưa đăng nhập) */}
                <Route element={<GuestRoute user={user} loading={loading} />}>
                    <Route path="/" element={<AuthPage />}>
                        <Route index element={<Login />} />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="verifyOtp" element={<VerifyOTP />} />
                    </Route>
                </Route>
                {/* Chỉ dành cho người đã đăng nhập */}
                <Route element={<ProtectedRoute user={user} loading={loading} />}>
                    <Route path="/home" element={<Home />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;