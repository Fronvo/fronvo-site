<script lang="ts">
    import type { FronvoAccount, Room } from 'interfaces/all';
    import { targetProfileModal, viewingProfile } from 'stores/modals';
    import { ourData } from 'stores/profile';
    import { onMount } from 'svelte';
    import type { Unsubscriber } from 'svelte/store';
    import { onDestroy } from 'svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import {
        ContextMenu,
        ContextMenuContent,
        ContextMenuItem,
        ContextMenuSeparator,
        ContextMenuTrigger,
    } from '$lib/components/ui/context-menu';
    import {
        currentChannel,
        currentRoomData,
        currentRoomId,
        currentRoomLoaded,
        currentRoomMessages,
        currentServer,
        dmsList,
        isInServer,
        mobileShowMembers,
    } from 'stores/rooms';
    import { sendPostRequest, setTitle } from 'utilities/main';
    import { goto } from '$app/navigation';
    import {
        Dialog,
        DialogClose,
        DialogContent,
        DialogDescription,
        DialogTitle,
    } from '$lib/components/ui/dialog';
    import Indicator from '../all/Indicator.svelte';

    export let profileData: FronvoAccount;

    let unsubscribe: Unsubscriber;

    let kicking = false;
    let banning = false;

    let processing = false;

    function showProfileModal(): void {
        if (profileData.id == $ourData.id) {
            $targetProfileModal = $ourData;
        } else {
            $targetProfileModal = profileData;
        }

        $viewingProfile = true;
    }

    function messageFriend(): void {
        if ($currentRoomData?.dmUser.id == profileData.id) {
            return;
        }

        attemptEnterRoom();

        // socket.emit(
        //     'createDM',
        //     {
        //         profileId: profileData.profileId,
        //     },
        //     attemptEnterRoom,
        // );
    }

    async function attemptEnterRoom(): Promise<void> {
        for (const dmIndex in $dmsList) {
            const dm = $dmsList[dmIndex] as Room;

            if (dm.dmUser.id != profileData.id) continue;

            if ($currentRoomData?.roomId == dm.roomId) return;

            dm.unreadCount = 0;

            $currentRoomData = dm;
            $currentRoomLoaded = false;
            $currentRoomLoaded = true;
            $currentRoomMessages = [];
            $currentRoomId = dm.roomId;

            $currentChannel = undefined;
            $currentServer = undefined;
            $isInServer = false;
            $mobileShowMembers = false;

            setTitle(`@${dm.dmUser.id}`);
            goto(`/@${dm.dmUser.id}`);
        }
    }

    async function kickMember() {
        processing = true;

        await sendPostRequest('members/kick', {
            id: $currentServer.id,
            memberId: profileData.id,
        });

        processing = false;
        kicking = false;
    }

    async function banMember() {
        processing = true;

        await sendPostRequest('members/ban', {
            id: $currentServer.id,
            memberId: profileData.id,
        });

        processing = false;
        banning = false;
    }

    onMount(() => {
        if (profileData.id == $ourData.id) {
            unsubscribe = ourData.subscribe((data) => {
                if (!data) return;

                profileData = data;
            });
        }

        // TODO: Just use the global store when available / experiment with store changes like $dmsList
        // socket.on('onlineStatusUpdated', ({ profileId, online }) => {
        //     if (profileId == profileData.profileId) {
        //         profileData.online = online;
        //     }
        // });

        // socket.on('profileDataUpdated', ({ profileId, username, avatar }) => {
        //     if (profileId == profileData.profileId) {
        //         profileData.username = username;
        //         profileData.avatar = avatar;

        //         // Live sync
        //         profileData = profileData;
        //     }
        // });

        // socket.on('profileStatusUpdated', ({ profileId, status }) => {
        //     if (profileId == profileData.profileId) {
        //         profileData.status = status;

        //         // Live sync
        //         profileData = profileData;
        //     }
        // });
    });

    onDestroy(() => {
        if (profileData.id == $ourData.id) {
            unsubscribe();
        }
    });
</script>

<ContextMenu>
    <ContextMenuTrigger class="w-full mt-1 mb-1">
        <Button
            variant="ghost"
            size="lg"
            on:click={showProfileModal}
            on:keydown={showProfileModal}
            class={`select-none pr-1 pl-1 w-full duration-0 flex justify-start ${
                !profileData.online ? 'offline' : ''
            }`}
        >
            <div class="flex items-center mr-1">
                <img
                    src={profileData.avatar
                        ? `${profileData.avatar}/tr:w-64:h-64`
                        : '/images/avatar.svg'}
                    alt={`${profileData.username}'s avatar`}
                    draggable={false}
                    class={`w-[32px] h-[32px] rounded-full ${
                        !profileData.avatar &&
                        'bg-primary border-accent border-[1px] p-[3px]'
                    }`}
                />

                <Indicator online={profileData.online} />
            </div>

            <div class="-translate-x-[8px]">
                <h1
                    class="text-sm text-start max-w-[150px] overflow-hidden text-ellipsis"
                >
                    {profileData?.username}
                </h1>

                {#if profileData.online && (profileData.status || profileData.currentTrack)}
                    <h1
                        class="text-xs text-[0.645rem] w-full flex-1 max-w-[150px] text-ellipsis overflow-hidden text-start text-primary/75"
                    >
                        {#if profileData.status}
                            {profileData.status}
                        {:else}
                            <div class="flex items-center">
                                <!-- Maybe in the future if we become boring -->
                                <!-- <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    class="min-w-[14px] w-[14px] h-[14px] mr-[2px]"
                                    ><path
                                        fill="currentColor"
                                        d="M17.9 10.9C14.7 9 9.35 8.8 6.3 9.75c-.5.15-1-.15-1.15-.6c-.15-.5.15-1 .6-1.15c3.55-1.05 9.4-.85 13.1 1.35c.45.25.6.85.35 1.3c-.25.35-.85.5-1.3.25m-.1 2.8c-.25.35-.7.5-1.05.25c-2.7-1.65-6.8-2.15-9.95-1.15c-.4.1-.85-.1-.95-.5s.1-.85.5-.95c3.65-1.1 8.15-.55 11.25 1.35c.3.15.45.65.2 1m-1.2 2.75c-.2.3-.55.4-.85.2c-2.35-1.45-5.3-1.75-8.8-.95c-.35.1-.65-.15-.75-.45c-.1-.35.15-.65.45-.75c3.8-.85 7.1-.5 9.7 1.1c.35.15.4.55.25.85M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"
                                    /></svg
                                > -->

                                <img
                                    src={profileData.currentTrack.icon}
                                    alt={`${profileData.currentTrack.title}\ song icon`}
                                    class="w-[14px] h-[14px] rounded-full mr-1"
                                    draggable={false}
                                />

                                <span
                                    class="max-w-[140px] flex-1 overflow-hidden text-ellipsis"
                                    >{profileData.currentTrack.title}</span
                                >
                            </div>
                        {/if}
                    </h1>
                {/if}
            </div>
        </Button>
    </ContextMenuTrigger>

    <ContextMenuContent class="w-[150px]">
        <ContextMenuItem on:click={showProfileModal}
            >View profile</ContextMenuItem
        >

        {#if $ourData.friends.includes(profileData.id)}
            <ContextMenuItem on:click={messageFriend}>Message</ContextMenuItem>
        {/if}

        {#if $ourData.id == $currentServer?.owner_id && $ourData.id != profileData.id}
            <ContextMenuSeparator />

            <ContextMenuItem
                on:click={() => {
                    kicking = true;
                }}>Kick</ContextMenuItem
            >

            <ContextMenuItem
                on:click={() => {
                    banning = true;
                }}
            >
                Ban</ContextMenuItem
            >
        {/if}
    </ContextMenuContent></ContextMenu
>

<Dialog bind:open={kicking} onOpenChange={(e) => (kicking = e)}>
    <DialogContent>
        <DialogTitle>Kick member</DialogTitle>
        <DialogDescription
            >Are you sure you want to kick <b>{profileData.id}</b> from
            <b>{$currentServer?.name}</b>?</DialogDescription
        >

        <div class="flex w-full">
            <DialogClose disabled={processing} class="mr-2"
                ><Button disabled={processing} variant="outline">Cancel</Button
                ></DialogClose
            >

            <span class="flex-1" />

            <Button
                disabled={processing}
                class="mr-2"
                on:click={kickMember}
                variant="destructive">Kick</Button
            >
        </div>
    </DialogContent>
</Dialog>

<Dialog bind:open={banning} onOpenChange={(e) => (banning = e)}>
    <DialogContent>
        <DialogTitle>Ban member</DialogTitle>
        <DialogDescription
            >Are you sure you want to ban <b>{profileData.id}</b> from
            <b>{$currentServer?.name}</b>?</DialogDescription
        >

        <div class="flex w-full">
            <DialogClose disabled={processing} class="mr-2"
                ><Button disabled={processing} variant="outline">Cancel</Button
                ></DialogClose
            >

            <span class="flex-1" />

            <Button
                disabled={processing}
                class="mr-2"
                on:click={banMember}
                variant="destructive">Ban</Button
            >
        </div>
    </DialogContent>
</Dialog>
