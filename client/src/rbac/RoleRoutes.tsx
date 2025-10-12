import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// import { ROLE_ROUTES } from "./lib";
import { logoutUser, selectUser, setPartialUser } from "../store/reducers/userSlice";
import { useUser } from "../api";

// import Sidebar from "../components/Sidebar/Sidebar";
import { Login, Register, Tasks } from "../pages"

// import { SLICE_NAMES } from "../constants/enums";

// import { RedirectOAuth } from "../pages";

import styles from "./RoleRoutes.module.scss";

const RoleRoutes = () => {
  const { me } = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const APP_USER = useSelector(selectUser);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (APP_USER) {
      me((_res, err) => {
        if (err) {
          if (err?.response?.status == 401) {
            dispatch(logoutUser({}));
            navigate("/auth/login");
          }
        }
        dispatch(setPartialUser(_res?.data ));
      });
    }
  }, []);

  return APP_USER ? (
    <div className={styles.body}>
      <div ref={scrollRef} className={styles.main}>
        <Routes>
          <Route path="*" element={<Navigate to={"/"} />} />
          <Route path="/" element={<Tasks />} />
        </Routes>
      </div>
    </div>
  ) : (
    <div className={styles.auth}>
      <Routes>
        <Route path="/*" element={<Navigate to={"/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
};

export default RoleRoutes;
