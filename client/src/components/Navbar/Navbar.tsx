import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { logoutUser, selectUser } from "../../store/reducers/userSlice";

import { AddUser, Logout, User } from "../../icons";
import styles from "./Navbar.module.scss";
import AllUsers from "../Modals/AllUsers/AllUsers";

type NavbarProps = {
  title: string;
};

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const ArrowIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={10}
    height={10}
    viewBox="0 0 10 10"
    fill="none"
    {...props}
  >
    <path
      d="M0 1C0 0.447716 0.447715 0 1 0H4.5C5.05228 0 5.5 0.447715 5.5 1V2C5.5 2.27614 5.27614 2.5 5 2.5C4.72386 2.5 4.5 2.27614 4.5 2V1L1 1V9H4.5V8C4.5 7.72386 4.72386 7.5 5 7.5C5.27614 7.5 5.5 7.72386 5.5 8V9C5.5 9.55228 5.05228 10 4.5 10H1C0.447715 10 0 9.55228 0 9V1Z"
      fill="#A91E0C"
    />
    <path
      d="M8.29289 5.5L7.14645 6.64645C6.95118 6.84171 6.95118 7.15829 7.14645 7.35355C7.34171 7.54882 7.65829 7.54882 7.85355 7.35355L9.78284 5.42426C10.0172 5.18995 10.0172 4.81005 9.78284 4.57574L7.85355 2.64645C7.65829 2.45118 7.34171 2.45118 7.14645 2.64645C6.95118 2.84171 6.95118 3.15829 7.14645 3.35355L8.29289 4.5L3 4.5V5.5L8.29289 5.5Z"
      fill="#A91E0C"
    />
  </svg>
);

const Navbar = ({ title }: NavbarProps) => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const [isOpen, setIsOpen] = useState(false);

  const handleModalOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={styles.navbar}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.container}>
          {user?.role == "admin" && (
            <div className={styles.add_user} onClick={handleModalOpen}>
              <User fill="#162029" />
              <p>User management</p>
            </div>
          )}
          <div className={styles.user_info}>
            <p>{user?.name}</p>
            <div
              className={styles.logout}
              onClick={() => dispatch(logoutUser(null))}
            >
              <Logout />
            </div>
          </div>
        </div>
      </div>
      {isOpen && <AllUsers setIsOpen={setIsOpen} />}
    </>
  );
};

export default Navbar;
