import type { FronvoAccount, OurAccount } from 'interfaces/all';
import { ourData } from 'stores/profile';
import { fetchUser, updateCachedAccount } from './main';

export async function loadProfile(
    cachedData: FronvoAccount[]
): Promise<FronvoAccount> {
    const tempOurData = (await fetchUser()) as OurAccount;

    // Force default value, we just want to cache our profile
    await updateCachedAccount(tempOurData.id, cachedData, tempOurData);

    ourData.set(tempOurData);

    await loadFriends(tempOurData, cachedData);
    await loadPendingFriends(tempOurData, cachedData);

    return tempOurData;
}

export async function loadFriends(
    ourData: OurAccount,
    cachedData: FronvoAccount[]
): Promise<void> {
    return new Promise(async (resolve) => {
        if (ourData.friends.length == 0) {
            resolve();
            return;
        }

        // Just put every friend in cache before finishing up
        const finishedReqs = [];

        for (const friendIndex in ourData.friends) {
            updateCachedAccount(ourData.friends[friendIndex], cachedData).then(
                () => {
                    finishedReqs.push(ourData.friends[friendIndex]);

                    checkLoadingDone();
                }
            );
        }

        function checkLoadingDone() {
            if (finishedReqs.length == ourData.friends.length) {
                resolve();
            }
        }
    });
}

export async function loadPendingFriends(
    ourData: OurAccount,
    cachedData: FronvoAccount[]
): Promise<void> {
    return new Promise(async (resolve) => {
        if (ourData.pending_friend_requests.length == 0) {
            resolve();
            return;
        }

        const finishedReqs = [];

        // Same as above
        for (const pendingFriendIndex in ourData.pending_friend_requests) {
            updateCachedAccount(
                ourData.pending_friend_requests[pendingFriendIndex],
                cachedData
            ).then(() => {
                finishedReqs.push(
                    ourData.pending_friend_requests[pendingFriendIndex]
                );
                checkLoadingDone();
            });
        }

        function checkLoadingDone() {
            if (finishedReqs.length == ourData.pending_friend_requests.length) {
                resolve();
            }
        }
    });
}
