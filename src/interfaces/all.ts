// ******************** //
// Interfaces for all kinds of files.
// ******************** //

export interface FronvoError {
    err: {
        msg: string;
        code: number;
        name: string;
        extras?: {
            for?: string;
            min?: number;
            max?: number;
        };
    };
}

export interface AccountPost {
    id: string;
    text: string;
    attachment: string;
    posted_at: string;
    profile_id: string;
}

export interface Post {
    post: AccountPost;
    profileData: FronvoAccount;
}

// export interface FronvoAccount {
//     profileId: string;
//     username: string;
//     bio: string;
//     avatar: string;
//     banner: string;
//     creationDate: string;
//     isSelf: boolean;
//     online: boolean;
//     totalPosts: number;
//     status?: string;
//     pendingFriendRequests?: string[];
//     friends: string[];
//     isTurbo?: boolean;
//     hasSpotify?: boolean;
//     spotifyName?: string;
//     spotifyURL?: string;
//     hasGithub?: boolean;
//     githubName?: string;
//     githubURL?: string;
//     currentTrack?: SpotifyCurrentTrack;
// }

export interface FronvoAccount {
    id: string;
    username: string;
    avatar: string;
    bio: string;
    email: string;
    created_at: string;
    status: string;
    last_data_req: string;
    online: boolean;
    is_self: boolean;
}

export interface OurAccount extends FronvoAccount {
    friends: string[];
    pending_friend_requests: string[];
    spotifyRefreshToken?: string;
    spotifyAccessToken?: string;
}

export interface SwitchedAccount {
    avatar: string;
    profileId: string;
    refreshToken: string;
}

export interface Room {
    roomId: string;
    totalMessages: number;
    unreadCount: number;
    dmUsers?: string[];
    dmUserOnline?: boolean;
    dmUser?: FronvoAccount;
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

export interface Member extends FronvoAccount {
    server_avatar: string;
    server_username: string;
    joined_at: string;
    roles: MemberRole[];
}

export interface BannedMember extends FronvoAccount {
    banned_at: string;
}

export interface Channel {
    id: string;
    name: string;
    created_at: string;
    server_id: string;
}

export interface RoomMessage {
    id: string;
    profile_id: string;
    channel_id: string;
    server_id: string;
    content: string;
    created_at: string;
    reply_id: string;
    edited: boolean;
    attachments: string[];
    spotify_embed: string;
    tenor_url: string;
}

export interface SpotifyCurrentTrack {
    title: string;
    href: string;
    icon: string;
    artists: { name: string; url: string }[];
    progress: number;
    duration: number;
}

export interface TenorGifs {
    gif: string;
    gif_medium: string;
    gif_tiny: string;
    gif_nano: string;
}

export interface FetchedMessage {
    message: RoomMessage;
    profileData: FronvoAccount;
}
