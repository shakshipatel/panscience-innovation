import { useState } from "react";
import { useSelector } from "react-redux";

import { selectUser } from "../../../store/reducers/userSlice";

import { Tick } from "../../../icons";
import styles from "./SelectAssignee.module.scss";

type Props = {
  allUsers: { id: string; name: string }[];
  ref: React.RefObject<null>;
  onSelect: (userId: string) => void;
  selectedUsers: { id: string; name: string }[];
};

const SelectAssignee = ({ allUsers, ref, onSelect, selectedUsers }: Props) => {
  const APP_USER = useSelector(selectUser);

  const [searchFilter, setSearchFilter] = useState<string>("");

  return (
    <div ref={ref} className={styles.select_assignee}>
      <div className={styles.search}>
        <input
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          type="text"
          placeholder="search users..."
        />
      </div>
      {allUsers
        ?.filter((user) =>
          user.name.toLowerCase().includes(searchFilter.toLowerCase())
        )
        ?.map((user) => (
          <div
            key={user.id}
            className={`${styles.user} ${
              selectedUsers.find((u) => u.id === user.id) ? styles.selected : ""
            }`}
            onClick={() => onSelect(user.id)}
          >
            <p>
              {user.name}
              {APP_USER?.id === user.id ? " (Me)" : ""}
            </p>
            {selectedUsers.find((u) => u.id === user.id) ? <Tick /> : null}
          </div>
        ))}
    </div>
  );
};

export default SelectAssignee;
