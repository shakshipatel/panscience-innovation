import { useState } from "react";

import useUser from "../../../api/useUser";

import styles from "./CreateUser.module.scss";

const CreateUser = () => {
  const { getAllUsers, register } = useUser();

  const [user, setUser] = useState({
    email: "",
    name: "",
    role: "user",
  });

  return <div className={styles.create_user}></div>;
};

export default CreateUser;
