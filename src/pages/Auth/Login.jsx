import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "./AuthLayout";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("abdulrahman4463810@gmail.com");
  const [password, setPassword] = useState("Sakb123456@");
  const [show, setShow] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/master-dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthLayout subtitle="Sign in to continue to your account">
      <form onSubmit={submit} className="auth-form">
        <h2 className="auth-title">Welcome Back!</h2>
        <div className="input-wrap"><FiMail className="icon" /><input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div className="input-wrap"><FiLock className="icon" /><input type={show ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><span className="eye" onClick={() => setShow(!show)}>{show ? <FiEyeOff /> : <FiEye />}</span></div>
        <div className="auth-row"><label className="remember"><input type="checkbox" /> Remember me</label><span className="auth-link auth-small" onClick={() => navigate("/forgot-password")}>Forgot Password?</span></div>
        <button className="auth-button" type="submit">Sign In</button>
        <p className="auth-center auth-small">Don't have an account? <span className="auth-link" onClick={() => navigate("/signup")}>Sign Up</span></p>
      </form>
    </AuthLayout>
  );
}
