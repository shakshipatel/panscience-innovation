import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import useUser from "../../../api/useUser";
import { selectUser } from "../../../store/reducers/userSlice";

import {
  Calendar,
  Cross,
  Cross2,
  Doc,
  Flame,
  Target,
  Upload,
  User,
} from "../../../icons";
import styles from "./AllUsers.module.scss";

const AllUsers = ({
  setAllUserModalOpen,
  setCreateUserModalOpen,
}: {
  setCreateUserModalOpen: (isOpen: boolean) => void;
  setAllUserModalOpen: (isOpen: boolean) => void;
}) => {
  const APP_USER = useSelector(selectUser);

  const { getAllUsers, deleteUser } = useUser();

  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    getAllUsers((response: any) => {
      setUsers(response.data);
    });
  };
  const deleteUserData = (id: string) => {
    // Implement user deletion logic here
    console.log(`Delete user with id: ${id}`);
    deleteUser(id, () => {
      fetchUsers();
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className={styles.all_users}>
      <div className={styles.header}>
        <p>All Users ({users.length})</p>
        <div
          className={styles.add_user}
          onClick={() => {
            setCreateUserModalOpen(true);
            setAllUserModalOpen(false);
          }}
        >
          <p>Add new</p>
        </div>
      </div>
      <div className={styles.container}>
        {users.map((user) => (
          <div key={user.id} className={styles.user_card}>
            <p>{user.name}</p>
            <span>|</span>
            <p>{user.role}</p>
            {
              // If its me don't show delete icon, show me
              APP_USER.id !== user.id ? (
                <Cross
                  onClick={() => deleteUserData(user.id)}
                  className={styles.delete_icon}
                />
              ) : (
                <p>(me)</p>
              )
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
