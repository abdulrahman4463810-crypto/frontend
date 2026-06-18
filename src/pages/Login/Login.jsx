import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import Input from "../../components/Input/Input";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import "./Login.css";

export default function Login({ go }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields ❌");
      return;
    }

    const ok = login(email, password);

    if (ok) {
      toast.success("Login Successful 🚀");
      go("home");
    } else {
      toast.error("Invalid Email or Password ❌");
    }
  };

  return (
    <AuthLayout subtitle="Sign in to continue">
      <form onSubmit={handleLogin} className="auth-form login-form">
        <h2 className="auth-title">Welcome Back!</h2>

        <Input
          icon={<FiMail size={17} />}
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <Input
          icon={<FiLock size={17} />}
          type={show ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          rightElement={
            <button className="icon-btn" type="button" onClick={() => setShow((v) => !v)}>
              {show ? <FiEyeOff size={17} /> : <FiEye size={17} />}
            </button>
          }
        />

        <div className="auth-row">
          <label className="remember">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>

          <span className="auth-link" onClick={() => go("forgot")}>Forgot Password?</span>
        </div>

        <button className="auth-button" type="submit">Sign In</button>

        <p className="auth-center auth-small">
          Don’t have an account? <span className="auth-link" onClick={() => go("signup")}>Sign Up</span>
        </p>
      </form>
    </AuthLayout>
  );
}
