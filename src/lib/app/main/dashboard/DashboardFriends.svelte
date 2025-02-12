<script lang="ts">
    import { fade } from 'svelte/transition';
    import { sineInOut } from 'svelte/easing';
    import Friend from '$lib/app/reusables/top/Friend.svelte';
    import { loadHomePosts } from 'utilities/dashboard';
    import { ourData } from 'stores/profile';
    import { cachedAccountData, isMobile } from 'stores/main';
    import { onMount } from 'svelte';
    import { findCachedAccount, setTitle } from 'utilities/main';
    import type { FronvoAccount } from 'interfaces/all';
    import { targetProfileModal } from 'stores/modals';
    import { Plus } from 'radix-icons-svelte';
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import {
        Dialog,
        DialogClose,
        DialogContent,
        DialogDescription,
        DialogTitle,
    } from '$lib/components/ui/dialog';
    import Input from '$lib/components/ui/input/input.svelte';
    import { toast } from 'svelte-sonner';
    import PropFriend from '$lib/app/reusables/rooms/PropFriend.svelte';
    import { DashboardFriendTab } from 'types/all';
    import { activeFriendsTab } from 'stores/dashboard';

    let friendsInfo: FronvoAccount[] = [];

    let pendingInfo: FronvoAccount[] = [];

    let tabHeaders = ['All Friends', 'Online', 'Pending'];

    let profileId = '';
    let open = false;
    let loading = false;
    let errorMessage = '';

    async function loadFriends(): Promise<void> {
        friendsInfo = [];

        if ($ourData.friends.length == 0) {
            return;
        }

        // Fetch all room members, notify UI once finished
        for (const friendIndex in $ourData.friends) {
            findCachedAccount(
                $ourData.friends[friendIndex],
                $cachedAccountData
            ).then((data) => {
                friendsInfo.push(data);

                checkLoadingDone();
            });
        }

        function checkLoadingDone(): void {
            // Finish loading
            if (friendsInfo.length == $ourData?.friends.length) {
                // Alphabetically
                friendsInfo.sort((a, b) =>
                    a.username.localeCompare(b.username)
                );

                friendsInfo = friendsInfo;
            }
        }
    }

    async function loadPendingFriends(): Promise<void> {
        pendingInfo = [];

        if ($ourData.pending_friend_requests.length == 0) {
            return;
        }

        // Fetch all room members, notify UI once finished
        for (const pendingIndex in $ourData.pending_friend_requests) {
            findCachedAccount(
                $ourData.pending_friend_requests[pendingIndex],
                $cachedAccountData
            ).then((data) => {
                pendingInfo.push(data);

                checkLoadingDone();
            });
        }

        function checkLoadingDone(): void {
            // Finish loading
            if (
                pendingInfo.length == $ourData?.pending_friend_requests.length
            ) {
                // Alphabetically
                pendingInfo.sort((a, b) =>
                    a.username.localeCompare(b.username)
                );

                pendingInfo = pendingInfo;
            }
        }
    }

    function addFriend(): void {
        if (!profileId || loading) return;

        if (profileId.trim().length == 0) {
            return;
        }

        // Custom errors to prettify
        if (profileId.length < 5) {
            errorMessage = 'Must be atleast 5 characters.';
            return;
        }

        loading = true;

        // socket.emit(
        //     'addFriend',
        //     { profileId: profileId ? profileId.toLowerCase() : '' },
        //     ({ err }) => {
        //         if (err) {
        //             // Prettify
        //             if (err.name == 'INVALID_REGEX') {
        //                 errorMessage =
        //                     'Identifier contains invalid characters.';
        //             } else {
        //                 errorMessage = err.msg;

        //                 loading = false;
        //             }
        //         } else {
        //             open = false;

        //             loading = false;

        //             toast.success('Friend request has been sent!');
        //         }
        //     },
        // );
    }

    onMount(() => {
        setTitle('Friends');

        loadFriends();
        loadPendingFriends();

        // socket.off('friendAdded');
        // socket.off('friendRemoved');
        // socket.off('pendingFriendRemoved');
        // socket.off('newFriendRequest');

        // socket.on('friendAdded', async ({ profileId }) => {
        //     $ourData.friends.push(profileId);
        //     $ourData = $ourData;

        //     loadFriends();

        //     loadHomePosts();

        //     if ($targetProfileModal.profileId !== profileId) {
        //         new Notification(`@${profileId}`, {
        //             body: 'Friend added',
        //             icon: `${
        //                 (await findCachedAccount(profileId, $cachedAccountData))
        //                     .avatar
        //             }/tr:w-256:h-256:r-max`,
        //         });
        //     }
        // });

        // socket.on('friendRemoved', ({ profileId }) => {
        //     $ourData.friends.splice($ourData.friends.indexOf(profileId), 1);
        //     $ourData = $ourData;

        //     loadFriends();

        //     loadHomePosts();
        // });

        // socket.on('pendingFriendRemoved', ({ profileId }) => {
        //     $ourData.pending_friend_requests.splice(
        //         $ourData.pending_friend_requests.indexOf(profileId),
        //         1,
        //     );
        //     $ourData = $ourData;

        //     loadPendingFriends();

        //     loadHomePosts();
        // });

        // socket.on('newFriendRequest', ({ profileId }) => {
        //     $ourData.pending_friend_requests.push(profileId);
        //     $ourData = $ourData;

        //     loadPendingFriends();

        //     loadHomePosts();
        // });
    });
</script>

<div
    class={`w-full ${$isMobile ? 'mobile' : ''}`}
    in:fade={{ duration: 200, easing: sineInOut }}
>
    <div
        class="fixed w-full border-b flex items-center p-3 pl-4 h-[45px] select-none overflow-x-auto overflow-y-hidden"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            class="w-[22px] h-[22px] mr-1"
            ><path
                fill="currentColor"
                d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 6v-.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2v.8q0 .825-.587 1.413T18 20H6q-.825 0-1.412-.587T4 18"
            /></svg
        >

        <h1 class="text-sm">Friends</h1>

        <Separator class="w-[1px] h-[100%] ml-4 mr-3" />

        {#each ['All', 'Online', 'Pending'] as tab, i}
            <Button
                class={`${
                    $activeFriendsTab === i
                        ? 'bg-accent/75 border-accent/75 hover:bg-accent/75'
                        : 'hover:bg-accent/50'
                } pt-0 pb-0 p-0 h-[32px] pr-4 pl-4 mr-2 rounded-full`}
                variant="ghost"
                on:click={() => ($activeFriendsTab = i)}
                >{tab}

                {#if tab === 'Pending'}
                    {#if $ourData.pending_friend_requests.length > 0}
                        <div
                            class="pr-1.5 pl-1.5 pt-[1px] pb-[1px] bg-destructive text-white font-black text-xs rounded-full ml-2"
                        >
                            {$ourData.pending_friend_requests.length}
                        </div>
                    {/if}
                {/if}
            </Button>
        {/each}

        <Separator class="w-[1px] h-[100%] ml-1 mr-4" />

        <Button class="rounded-full h-[32px]" on:click={() => (open = true)}
            ><Plus class="mr-2" /> Add friend</Button
        >
    </div>

    <div
        class="friends-container flex flex-col overflow-y-auto mt-[48px] p-4 pt-2 pb-1"
        style={`height: calc(100vh - 48px)`}
    >
        <h1
            class="text-[0.7rem] text-primary/75 ml-4 uppercase font-semibold pb-2 tracking-wide select-none"
        >
            {tabHeaders[$activeFriendsTab]} -

            {#if $activeFriendsTab === DashboardFriendTab.All}
                {friendsInfo.length}
            {:else if $activeFriendsTab === DashboardFriendTab.Online}
                {friendsInfo.filter((v) => v.online).length}
            {:else if $activeFriendsTab === DashboardFriendTab.Pending}
                {pendingInfo.length}
            {/if}
        </h1>

        {#if $activeFriendsTab === DashboardFriendTab.All}
            {#if friendsInfo.length > 0}
                {#each friendsInfo as profileData}
                    <Friend {profileData} />
                {/each}
            {:else}
                {#each { length: 5 } as _}
                    <PropFriend />
                {/each}
            {/if}
        {:else if $activeFriendsTab === DashboardFriendTab.Online}
            {#if friendsInfo.filter((v) => v.online).length > 0}
                {#each friendsInfo as profileData}
                    <Friend
                        {profileData}
                        showIfOnline
                        onlineStatusChanged={(online) => {
                            friendsInfo = friendsInfo.map((v) => {
                                if (v.id === profileData.id) {
                                    return { ...v, online };
                                } else return v;
                            });
                        }}
                    />
                {/each}
            {:else}
                {#each { length: 5 } as _}
                    <PropFriend />
                {/each}
            {/if}
        {:else if $activeFriendsTab === DashboardFriendTab.Pending}
            {#if pendingInfo.length > 0}
                {#each pendingInfo as profileData}
                    <Friend {profileData} />
                {/each}
            {:else}
                {#each { length: 5 } as _}
                    <PropFriend />
                {/each}
            {/if}
        {/if}
    </div>
</div>

<Dialog
    bind:open
    onOpenChange={(e) => {
        open = e;
        profileId = '';
        errorMessage = '';
    }}
>
    <DialogContent>
        <DialogTitle>Add friend</DialogTitle>

        <DialogDescription>Send a friend request to a user</DialogDescription>

        {#if errorMessage}
            <h1 class="text-destructive font-medium text-sm">
                {errorMessage}
            </h1>
        {/if}

        <div class="flex items-center">
            <h1 class="text-xl mr-2 mt-0">@</h1>

            <Input bind:value={profileId} maxlength={20} />
        </div>

        <div class="flex items-center justify-end">
            <DialogClose
                ><Button variant="outline" class="mr-2">Cancel</Button
                ></DialogClose
            >

            <Button disabled={loading} on:click={addFriend}>Send request</Button
            >
        </div>
    </DialogContent>
</Dialog>
