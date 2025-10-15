import { useSelector } from "react-redux";

import { selectUser } from "../../store/reducers/userSlice";

import { Cross } from "../../icons";
import styles from "./UserTag.module.scss";

type Props = {
  id: string;
  name: string;
  onRemove?: () => void;
};

export function stringToHexCompact(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  const r = (hash >> 16) & 0xff;
  const g = (hash >> 8) & 0xff;
  const b = hash & 0xff;
  // optional: boost lightness to avoid too-dark colors
  const boost = 30;
  const clamp = (v: number) => Math.max(0, Math.min(255, v + boost));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();
}

const UserTag = ({ id, name, onRemove }: Props) => {
  const APP_USER = useSelector(selectUser);

  return (
    <div className={styles.user_tag} onClick={(e) => e.stopPropagation()}>
      <div
        className={styles.icon}
        style={{ background: stringToHexCompact(id) }}
      >
        <p>
          {name
            ?.split(" ")
            ?.map((word) => word[0])
            ?.join("")
            ?.slice(0, 2)}
        </p>
      </div>
      <p className={styles.name}>
        {name}
        {APP_USER?.id === id ? " (Me)" : ""}
      </p>
      <Cross className={styles.cursor} size={16} onClick={onRemove} />
    </div>
  );
};

export default UserTag;
