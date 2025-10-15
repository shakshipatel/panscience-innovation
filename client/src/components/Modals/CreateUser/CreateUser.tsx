import { useRef, useState } from "react";

import useUser from "../../../api/useUser";

import RoleModal from "../RoleModal/RoleModal";

import styles from "./CreateUser.module.scss";
import { User } from "../../../icons";
import { successToast } from "../../../lib/toast";

const CreateUser = ({
  setCreateUserModalOpen,
}: {
  setCreateUserModalOpen: (isOpen: boolean) => void;
}) => {
  const roleModalRef = useRef<HTMLDivElement>(null);

  const { getAllUsers, register, userLoading } = useUser();

  const [user, setUser] = useState({
    email: "",
    name: "",
    role: "user",
    password: "",
  });
  const [roleModal, setRoleModal] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!user.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email))
      newErrors.email = "Enter a valid email address.";

    if (!user.password.trim()) newErrors.password = "Password is required.";
    else if (user.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (!validate()) return;

    register(
      {
        email: user.email.trim().toLocaleLowerCase(),
        password: user.password.trim(),
        name: user.name.trim(),
        role: user.role,
      },

      (_res, err) => {
        if (err) {
          console.error(err);
          setErrors({ password: "Invalid email or password. Try again." });
        } else {
          successToast("User created successfully!");
          setCreateUserModalOpen(false);
        }
      }
    );
  };
  const handleCancel = () => {
    setCreateUserModalOpen(false);
  };

  return (
    <div className={styles.create_user}>
      <div className={styles.form_data}>
        <div className={styles.form_row}>
          <div className={styles.label}>
            <p>Name</p>
          </div>
          <div className={styles.field}>
            <input
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              type="text"
              placeholder="Enter name..."
            />
          </div>
        </div>
        <div className={styles.form_row}>
          <div className={styles.label}>
            <p>Email</p>
          </div>
          <div className={styles.field}>
            <input
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              type="text"
              placeholder="Enter email..."
            />
          </div>
        </div>
        <div className={styles.form_row}>
          <div className={styles.label}>
            <p>Password</p>
          </div>
          <div className={styles.field}>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              type="password"
              placeholder="Enter password..."
            />
          </div>
        </div>
        <div className={styles.form_row}>
          <div className={styles.label}>
            <p>Role</p>
          </div>
          <div className={styles.field} onClick={() => setRoleModal(true)}>
            {roleModal && (
              <RoleModal
                ref={roleModalRef}
                selectedState={user.role}
                onSelect={(role) => {
                  setUser({
                    ...user,
                    role: role,
                  });
                  setRoleModal(false);
                }}
                setRoleModal={setRoleModal}
              />
            )}
            {user.role === "admin" ? (
              <div className={styles.admin}>
                <p>admin</p>
              </div>
            ) : user.role === "user" ? (
              <div className={styles.user}>
                <p>user</p>
              </div>
            ) : (
              <div className={styles.user}>
                <p>no role</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {(errors.email || errors.password) && (
        <div className={styles.errors}>
          {errors.email && <p>{errors.email}</p>}
          {errors.password && <p>{errors.password}</p>}
        </div>
      )}
      <div className={styles.buttons}>
        <div className={styles.cancel} onClick={handleCancel}>
          <p>Cancel</p>
        </div>
        <div className={styles.save} onClick={handleRegister}>
          <p>{userLoading ? "Creating..." : "Create User"}</p>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
