import { Tick } from "../../../icons";

import styles from "./RoleModal.module.scss";

const RoleModal = ({
  ref,
  onSelect,
  selectedState,
  setRoleModal,
}: {
  ref: React.RefObject<null>;
  onSelect: (role: "admin" | "user") => void;
  selectedState: string;
  setRoleModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div ref={ref} className={styles.select_status}>
      <div className={styles.admin}>
        <div
          onClick={() => {
            onSelect("admin");
            setRoleModal(false);
          }}
        >
          <p>admin</p>
        </div>
        {selectedState === "admin" && <Tick />}
      </div>
      <div className={styles.user}>
        <div
          onClick={() => {
            onSelect("user");
            setRoleModal(false);
          }}
        >
          <p>user</p>
        </div>
        {selectedState === "user" && <Tick />}
      </div>
    </div>
  );
};

export default RoleModal;
