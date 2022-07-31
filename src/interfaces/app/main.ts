// ******************** //
// Shared interfaces for the app route, after login.
// ******************** //

export interface FronvoAccount {
    profileId: string;
    username: string;
    bio: string;
    email?: string;
    avatar: string;
    creationDate: string;
    following: string[];
    followers: string[];
    isSelf: boolean;
}

export interface AccountPost {
    author: string;
    title: string;
    content: string;
    attachment?: string;
    creationDate: string;
}
