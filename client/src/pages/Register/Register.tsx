import { useState } from "react";

import { successToast } from "../../lib/toast";
import { useUser } from "../../api";

import styles from "./Register.module.scss";

const Register = () => {
  const { register, userLoading } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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

  const handleRegister = () => {
    if (!validate()) return;

    register(
      {
        email: email.trim().toLocaleLowerCase(),
        password: password.trim(),
        name: name.trim(),
      },

      (_res, err) => {
        if (err) {
          console.error(err);
          setErrors({ password: "Invalid email or password." });
        } else {
          successToast("Registered successfully!");
          window.location.href = "/login";
        }
      }
    );
  };
  return (
    <div className={styles.login_page}>
      <img src="/login-page.png" className={styles.img} alt="Logo" />
      <div className={styles.form}>
        <h1>Welcome to Panscience Innovation</h1>
        <div className={styles.inputs}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Enter your name..."
            className={styles.name}
          />
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
            className={styles.password}
          />
        </div>
        <div onClick={handleRegister} className={styles.button}>
          <p>{userLoading ? "Registering..." : "Register"}</p>
        </div>
        <p className={styles.alter}>
          Already have an account?{" "}
          <span onClick={() => (window.location.href = "/login")}>
            Login here...
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
