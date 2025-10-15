import { useState } from "react";
import { useDispatch } from "react-redux";

import { useUser } from "../../api";

import { setUser } from "../../store/reducers/userSlice";

import styles from "./Login.module.scss";

const Login = () => {
  const dispatch = useDispatch();
  const { login } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email address.";

    if (!password.trim()) newErrors.password = "Password is required.";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;

    login({ email, password }, (res, err) => {
      if (err) {
        console.error(err);
        setErrors({ password: "Invalid email or password." });
      } else {
        dispatch(setUser(res?.data));
      }
    });
  };

  return (
    <div className={styles.login_page}>
      <img src="/login-page.png" className={styles.img} alt="Logo" />
      <div className={styles.form}>
        <h1>Login to continue</h1>
        <div className={styles.inputs}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Enter your email..."
            className={styles.email}
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter your password..."
            className={styles.email}
          />
        </div>
        <div onClick={handleLogin} className={styles.button}>
          <p>Login</p>
        </div>
        <p className={styles.alter}>
          Don't have account?{" "}
          <span onClick={() => (window.location.href = "/register")}>
            Signup here...
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
