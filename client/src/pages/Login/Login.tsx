import { useState } from "react";
import { useUser } from "../../api";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/reducers/userSlice";
import styles from "./Login.module.scss";

const Login = () => {
  const dispatch = useDispatch();
  const { login } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

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
        console.log(res?.data);
        dispatch(setUser(res?.data));
      }
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.form}>
        <p>Login Page</p>

        <div className={styles.inputGroup}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>

        <div className={styles.inputGroup}>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          {errors.password && <span className={styles.error}>{errors.password}</span>}
        </div>

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
