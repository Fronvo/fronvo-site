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
    postId: string;
    author: string;
    title: string;
    content: string;
    attachment?: string;
    creationDate: string;
}

export interface HomePost {
    post: AccountPost;
    profileData: FronvoAccount;
}

export interface FronvoAccount {
    profileId: string;
    username: string;
    bio: string;
    email?: string;
    avatar: string;
    banner: string;
    creationDate: string;
    following: string[];
    followers: string[];
    isSelf: boolean;
    isPrivate: boolean;
    isFollower: boolean;
    isInCommunity: boolean;
    communityId: string;
    isAdmin: boolean;
    isDisabled: boolean;
    totalPosts: number;
}

export interface Community {
    communityId: string;
    ownerId: string;
    name: string;
    description: string;
    creationDate: string;
    icon?: string;
    members: string[];
    inviteOnly: boolean;
    acceptedChatRequests: string[];
    totalMessages: number;
}

export interface CommunityMessage {
    messageId: string;
    ownerId: string;
    content: string;
    creationDate: string;
    isReply: boolean;
    replyContent: string;
}

export interface CommunityMessageFinal extends CommunityMessage {
    profileData: FronvoAccount;
}

export interface FronvoContainer {
    title: string;
    svg: string;
}

export interface JoinRequest {
    email: string;
}
