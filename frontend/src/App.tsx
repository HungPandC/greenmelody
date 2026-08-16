import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyRegisterOTP";
import ForgotPassword from "./pages/ResetPassword/ForgotPassword";
import VerifyResetOTP from "./pages/ResetPassword/VerifyResetOTP";
import NewPassword from "./pages/ResetPassword/NewPassword";
import Home from "./pages/Home/Home";
import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";
import useAuth from "./hooks/useAuth";
import EarTraining from "./pages/Eartraining/Eartraining";
import SkillLessonList from "./pages/Eartraining/SkillLessonList";
import LessonExercise from "./pages/Eartraining/LessonExercise";
import Journey from "./pages/Journey/Journey";
import Practice from "./pages/Practice/Practice";
import Reading from "./pages/Reading/Reading";
import Garden from "./pages/Garden/Garden";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import Challenges from "./pages/Challenges/Challenges";
import ChallengeDetail from "./pages/Challenges/ChallengeDetail";
import SetTarget from "./pages/Challenges/SetTarget";

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
                        <Route path="forgot-password" element={<ForgotPassword />} />
                        <Route path="reset-password/verify" element={<VerifyResetOTP />} />
                        <Route path="reset-password/new" element={<NewPassword />} />
                    </Route>
                </Route>
                {/* Chỉ dành cho người đã đăng nhập */}
                <Route element={<ProtectedRoute user={user} loading={loading} />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/journey" element={<Journey />} />
                    <Route path="/garden" element={<Garden />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />

                    <Route path="/challenges" element={<Challenges />} />
                    <Route path="/challenges/set-target" element={<SetTarget />} />
                    <Route path="/challenges/:id" element={<ChallengeDetail />} />

                    {/* Cảm âm */}
                    <Route path="/ear-training" element={<EarTraining />} />
                    <Route path="/ear-training/:skill" element={<SkillLessonList basePath="/ear-training" backLabel="Cảm âm" />} />
                    <Route path="/ear-training/:skill/lesson/:lessonId" element={<LessonExercise basePath="/ear-training" />} />

                    {/* Đọc nhạc - tách riêng khỏi Thực hành */}
                    <Route path="/reading" element={<Reading />} />
                    <Route path="/reading/:skill" element={<SkillLessonList basePath="/reading" backLabel="Đọc nhạc" />} />
                    <Route path="/reading/:skill/lesson/:lessonId" element={<LessonExercise basePath="/reading" />} />

                    {/* Thực hành */}
                    <Route path="/practice" element={<Practice />} />
                    <Route path="/practice/:skill" element={<SkillLessonList basePath="/practice" backLabel="Thực hành" />} />
                    <Route path="/practice/:skill/lesson/:lessonId" element={<LessonExercise basePath="/practice" />} />

                    {/* giữ route cũ để không phá link nào đang trỏ tới /interval */}
                    <Route path="/interval" element={<Navigate to="/ear-training/interval" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
