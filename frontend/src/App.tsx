import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { useState,useEffect,useContext } from "react";
import AuthPage from "./pages/AuthPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyRegisterOTP";
import Home from "./pages/Home/Home.tsx";
import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";
import useAuth from "./hooks/useAuth";
import EarTraining from "./pages/Eartraining/Eartraining.tsx";
import IntervalLesson from "./pages/Interval/IntervalLesson.tsx";
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
                    <Route path="/ear-training" element={<EarTraining />} />
                    <Route path="/interval" element={<IntervalLesson />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;