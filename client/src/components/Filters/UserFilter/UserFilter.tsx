import { useState } from "react"
import styles from "./UserFilter.module.scss"
import { Tick } from "../../../icons"

type Props = {
  allUsers: { id: string, name: string }[],
  ref: React.RefObject<null>,
  onSelect: (userId: string) => void,
  selectedUsers: string[],
}

const UserFilter = ({ allUsers, ref, onSelect, selectedUsers }: Props) => {
  const [searchFilter, setSearchFilter] = useState<string>("")
  return (
    <div ref={ref} className={styles.select_assignee}>
      <div className={styles.search}>
        <input value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} type="text" placeholder="search users..." />
      </div>
      {
        allUsers?.filter(user => user.name.toLowerCase().includes(searchFilter.toLowerCase()))?.map(user => (
          <div key={user.id} className={`${styles.user} ${selectedUsers.includes(user.id) ? styles.selected : ""}`} onClick={() => onSelect(user.id)}>
            <p>{user.name}</p>
            {selectedUsers.includes(user.id) ? (<Tick />) : null}
          </div>
        ))
      }
    </div>
  )
}

export default UserFilter