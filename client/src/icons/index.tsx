// @ts-nocheck;

import Icon from './Icon';

type Props = {
  name?: string;
  size?: number;
  color?: string;
  stroke?: string;
  onClick?: () => void
  cursor?: string;
  className?: string;
};

export const AddUser = (props: Props) => <Icon {...props} name="add-user" />;
export const Add = (props: Props) => <Icon {...props} name="add" />;
export const AlphabetSort = (props: Props) => <Icon {...props} name="alphabet-sort" />;
export const ArrowDown = (props: Props) => <Icon {...props} name="arrow-down" />;
export const ArrowLeft = (props: Props) => <Icon {...props} name="arrow-left" />;
export const ArrowUp = (props: Props) => <Icon {...props} name="arrow-up" />;
export const Attachment = (props: Props) => <Icon {...props} name="attachment" />;
export const Calendar = (props: Props) => <Icon {...props} name="calendar" />;
export const Cross2 = (props: Props) => <Icon {...props} name="cross-2" />;
export const Cross = (props: Props) => <Icon {...props} name="cross" />;
export const Doc2 = (props: Props) => <Icon {...props} name="doc-2" />;
export const Doc = (props: Props) => <Icon {...props} name="doc" />;
export const DropdownArrow = (props: Props) => <Icon {...props} name="dropdown-arrow" />;
export const Flame = (props: Props) => <Icon {...props} name="flame" />;
export const Logout = (props: Props) => <Icon {...props} name="logout" />;
export const Sort = (props: Props) => <Icon {...props} name="sort" />;
export const Target = (props: Props) => <Icon {...props} name="target" />;
export const Tick = (props: Props) => <Icon {...props} name="tick" />;
export const Upload = (props: Props) => <Icon {...props} name="upload" />;
export const User = (props: Props) => <Icon {...props} name="user" />;