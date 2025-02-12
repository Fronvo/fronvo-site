import { goto } from '$app/navigation';
import type {
    FronvoAccount,
    OurAccount,
    Post,
    Room,
    Server,
    SwitchedAccount,
} from 'interfaces/all';
import { fronvoTitle, loginSucceeded } from 'stores/main';
import { loadRoomsData, loadServersData } from './rooms';
import { getKey, setKey } from './global';
import { loadProfile } from './profile';
import { loadHomePosts, loadOurPosts } from './dashboard';
import Cookies from 'js-cookie';
import { PUBLIC_FRONVO_API_URL } from '$env/static/public';

export async function performLogin(
    cachedAccountData: FronvoAccount[]
): Promise<void> {
    return new Promise((resolve) => {
        async function loadAccountData(): Promise<void> {
            return new Promise((resolve) => {
                let profileData: FronvoAccount;
                let rooms: Room[];
                let serversList: Server[];
                let dashboardPosts: Post[];
                let ourPosts: Post[];

                loadProfile(cachedAccountData).then((data) => {
                    profileData = data;

                    loadOurPosts().then((posts) => {
                        ourPosts = posts;
                    });
                });

                loadRoomsData().then((convos) => {
                    rooms = convos;
                });

                loadServersData().then((servers) => {
                    serversList = servers;
                });

                loadHomePosts().then((posts) => {
                    dashboardPosts = posts;
                });

                // instead of just using callbacks, login is very fast either way
                const interval = setInterval(() => {
                    if (
                        profileData &&
                        rooms &&
                        serversList &&
                        dashboardPosts &&
                        ourPosts
                    ) {
                        resolve();

                        loginSucceeded.set(true);
                        clearInterval(interval);
                    }
                }, 10);
            });
        }

        async function regenerateAccessToken() {
            const res = await sendRequest('token', true);

            return res.accessToken;
        }

        if (!Cookies.get('refreshToken')) {
            goto('/', {
                replaceState: true,
            });
        } else {
            async function refreshTokenWrapper(login = false) {
                const token = await regenerateAccessToken();

                if (token) {
                    Cookies.set('accessToken', `Bearer ${token}`, {
                        expires: new Date(
                            new Date().getTime() + 60 * 60 * 1000
                        ),
                    });

                    if (login) {
                        await loadAccountData();
                        resolve();
                    }
                } else {
                    Cookies.remove('accessToken');
                    Cookies.remove('refreshToken');

                    localStorage.clear();

                    goto('/', {
                        replaceState: true,
                    });
                }
            }

            refreshTokenWrapper(true);

            // Refresh accessToken a little before every hour
            setInterval(() => refreshTokenWrapper(), 3500000);
        }
    });
}

export async function fetchUser(
    id?: string
): Promise<FronvoAccount | OurAccount> {
    // If no id, fetch self
    return (await sendRequest(id ? `user/${id}` : 'me')).profileData;
}

export function setTitle(title: string, removePrefix?: boolean): void {
    fronvoTitle.set(
        `${!removePrefix ? 'Fronvo' : ''}${
            title.length > 0 && !removePrefix ? ' | ' : ''
        }${title}`
    );
}

export async function findCachedAccount(
    profileId: string,
    cachedData: FronvoAccount[]
): Promise<FronvoAccount> {
    for (const accountIndex in cachedData) {
        const targetAccount = cachedData[accountIndex];

        if (targetAccount.id == profileId) {
            return targetAccount;
        }
    }

    // Not found in cache, create and return
    return await updateCachedAccount(profileId, cachedData);
}

export async function updateCachedAccount(
    profileId: string,
    cachedData: FronvoAccount[],
    defaultValue?: FronvoAccount
): Promise<FronvoAccount | undefined> {
    let accountFound = false;
    let accountIndex = -1;

    for (const accountIndexNum in cachedData) {
        const targetAccount = cachedData[accountIndexNum];

        if (targetAccount.id == profileId) {
            accountFound = true;
            accountIndex = Number(accountIndexNum);
            break;
        }
    }

    const tempCachedData = cachedData || [];

    // Remove old entry
    if (accountFound) {
        tempCachedData.splice(Number(accountIndex), 1);
    }

    // Will also create / use default if not found, used in findCachedAccount
    let newData: FronvoAccount;

    if (defaultValue) {
        newData = defaultValue;
    } else {
        newData = await fetchUser(profileId);
    }

    // Might be an invalid profile, ignore
    if (newData) {
        tempCachedData.push(newData);
    }

    return newData;
}

export function addSavedAccount(
    ourData: FronvoAccount,
    refreshToken: string,
    avatar: string,
    profileId: string,
    newRefreshToken: string
): void {
    const oldKey: SwitchedAccount[] = JSON.parse(getKey('savedAccounts', '[]'));

    const formattedToken = refreshToken.replace('Bearer ', '');
    const formattedNewToken = newRefreshToken.replace('Bearer ', '');

    // First, add the active account if it's not added
    if (oldKey.length == 0) {
        oldKey.push({
            profileId: ourData.id,
            avatar: ourData.avatar,
            refreshToken: formattedToken,
        });
    }

    // Save our progress
    setKey('savedAccounts', JSON.stringify(oldKey));

    // Now, check if the target account has been added already
    for (const savedIndex in oldKey) {
        // If so, no need to do anything
        // Remember to compare tokens, avatars and usernames are malleable
        if (oldKey[savedIndex].profileId == profileId) return;
    }

    // If we have reached this stage, we can safely add the new account
    oldKey.push({
        profileId,
        avatar,
        refreshToken: formattedNewToken,
    });

    // Save again
    setKey('savedAccounts', JSON.stringify(oldKey));
}

export function updateSavedAccount(
    avatar: string,
    profileId: string,
    refreshToken: string
): void {
    const oldKey: SwitchedAccount[] = JSON.parse(getKey('savedAccounts', '[]'));
    const newKey: SwitchedAccount[] = [];

    for (const savedIndex in oldKey) {
        // Every index, update the one we want aswell
        if (oldKey[savedIndex].refreshToken == refreshToken) {
            oldKey[savedIndex].avatar = avatar;
            oldKey[savedIndex].profileId = profileId;
        }

        newKey.push(oldKey[savedIndex]);
    }

    setKey('savedAccounts', JSON.stringify(newKey));
}

export function getSavedAccounts(): SwitchedAccount[] {
    return JSON.parse(getKey('savedAccounts', '[]'));
}

export function removeSavedAcount(profileId: string): void {
    const oldKey: SwitchedAccount[] = JSON.parse(getKey('savedAccounts', '[]'));
    const newKey: SwitchedAccount[] = [];

    for (const savedIndex in oldKey) {
        // All except target token
        if (oldKey[savedIndex].profileId != profileId) {
            newKey.push(oldKey[savedIndex]);
        }
    }

    setKey('savedAccounts', JSON.stringify(newKey));
}

export function isAcceptedImage(type: string): boolean {
    return type.includes('image') && !type.includes('svg');
}

export function checkHasJWT(): boolean {
    return Cookies.get('refreshToken')?.length > 0;
}

export async function sendRequest(
    path: string, // TODO: Type complete
    useRefreshToken = false,
    customToken = ''
): Promise<any> {
    return await (
        await fetch(`${PUBLIC_FRONVO_API_URL}/${path}`, {
            headers: {
                Authorization: !customToken
                    ? Cookies.get(
                          useRefreshToken ? 'refreshToken' : 'accessToken'
                      )
                    : `Bearer ${customToken}`,
            },
        })
    ).json();
}

export async function sendPostRequest(
    path: string,
    body: {} = {},
    omitCredentials = false
): Promise<any> {
    const headers = {
        'content-type': 'application/json',
    };

    if (!omitCredentials) {
        headers['Authorization'] = Cookies.get('accessToken') as string;
    }

    return await (
        await fetch(`${PUBLIC_FRONVO_API_URL}/${path}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers,
        })
    ).json();
}

export async function sendDeleteRequest(
    path: string,
    body: {} = {},
    omitCredentials = false
): Promise<any> {
    const headers = {
        'content-type': 'application/json',
    };

    if (!omitCredentials) {
        headers['Authorization'] = Cookies.get('accessToken') as string;
    }

    return await (
        await fetch(`${PUBLIC_FRONVO_API_URL}/${path}`, {
            method: 'DELETE',
            body: JSON.stringify(body),
            headers,
        })
    ).json();
}

export function isRequestErrored(req: any) {
    return req.failure !== undefined || req.errors !== undefined;
}

export function getRequestError(req: any) {
    return req.failure || req.errors[0].message;
}
