export interface DM {
  id: string;
  last_message_at: string;
  other_user: Partial<UserData>;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  created_at: string;
  server_id: string;
}

export interface Role {
  id: string;
  name: string;
  hex_color: string;
  created_at: string;
}

export interface MemberRole {
  id: string;
  assigned_at: string;
  profile_id: string;
  role_id: string;
  server_id: string;
}

export interface Server {
  id: string;
  name: string;
  avatar: string;
  banner: string;
  invite: string;
  invites_disabled: boolean;
  members: Member[];
  banned_members: BannedMember[];
  channels: Channel[];
  roles: Role[];
  owner_id: string;
}

export interface UserData {
  id: string;
  username: string;
  avatar: string;
  email: string;
  created_at: string;
  status: LastStatus;
  note: string;
  dm_option: DMOption;
  filter_option: FilterOption;
  default_tab: TabOption;
  last_data_req: string;
  dms: DM[];
  servers: Server[];
}

export interface Member {
  id: string;
  avatar: string;
  banner: string;
  bio: string;
  server_avatar: string;
  server_username: string;
  username: string;
  created_at: string;
  joined_at: string;
  roles: MemberRole[];
}

export interface BannedMember {
  id: string;
  avatar: string;
  banner: string;
  bio: string;
  server_avatar: string;
  server_banner: string;
  username: string;
  created_at: string;
  banned_at: string;
}

export type LastStatus = 0 | 1 | 2 | 3;
export type OnlineStatus = "Online" | "Do Not Disturb" | "Idle" | "Offline";

export type DMOption = 0 | 1;
export type DMSetting = "Everyone" | "Friends";

export type FilterOption = 0 | 1;
export type FilterSetting = "Everything" | "Nothing";

export type ThemeOption = 0 | 1;
export type ThemeSetting = "White" | "Dark";

export type TabOption = 0 | 1;
export type TabSetting = "Home" | "Messaging";
