<script lang="ts">
    import type { FronvoAccount, Room } from 'interfaces/all';
    import { targetProfileModal, viewingProfile } from 'stores/modals';
    import { onMount } from 'svelte';
    import Button from '$lib/components/ui/button/button.svelte';
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
    import { setTitle } from 'utilities/main';
    import { goto } from '$app/navigation';
    import {
        ContextMenu,
        ContextMenuContent,
        ContextMenuItem,
        ContextMenuSeparator,
        ContextMenuTrigger,
    } from '$lib/components/ui/context-menu';
    import Indicator from '../all/Indicator.svelte';

    export let profileData: FronvoAccount;
    export let showIfOnline = false;
    export let onlineStatusChanged: (online: boolean) => void = () => {};

    let onlineP = false;

    function showProfileModal(): void {
        $targetProfileModal = profileData;

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

    onMount(() => {
        onlineP = profileData.online;

        // socket.on('onlineStatusUpdated', ({ profileId, online }) => {
        //     if (profileId == profileData.profileId) {
        //         profileData.online = online;
        //         onlineP = online;

        //         onlineStatusChanged(online);

        //         profileData = profileData;
        //     }
        // });

        // socket.on('profileDataUpdated', ({ profileId, username, avatar }) => {
        //     if (profileId == profileData.profileId) {
        //         profileData.username = username;
        //         profileData.avatar = avatar;

        //         profileData = profileData;
        //     }
        // });

        // socket.on('profileStatusUpdated', ({ profileId, status }) => {
        //     if (profileId == profileData.profileId) {
        //         profileData.status = status;

        //         profileData = profileData;
        //     }
        // });
    });
</script>

{#if !showIfOnline || (showIfOnline && onlineP)}
    <ContextMenu>
        <ContextMenuTrigger>
            <Button
                on:click={showProfileModal}
                on:keydown={showProfileModal}
                variant="ghost"
                class={`select-none group flex w-full rounded-none duration-0 border-b hover:bg-accent/50 border-b-border/40 text-start p-1.5 pr-3 pl-3 h-[52px] min-h-[48px] ${
                    !profileData.online ? 'offline' : ''
                }`}
            >
                <div class="flex items-center">
                    <img
                        src={profileData.avatar
                            ? `${profileData.avatar}/tr:w-72:h-72`
                            : '/images/avatar.svg'}
                        alt={`${profileData.username}'s avatar`}
                        draggable={false}
                        class={`w-[36px] h-[36px] rounded-full ${
                            !profileData.avatar &&
                            'bg-primary border-accent border-[1px] p-[3px]'
                        }`}
                    />

                    <Indicator online={onlineP} />
                </div>

                <div class="flex flex-col flex-1">
                    <div class="flex items-center">
                        <h1
                            id="username"
                            class="text-md max-w-[200px] mr-2 overflow-hidden font-semibold text-ellipsis"
                        >
                            {profileData?.username}
                        </h1>

                        <h1
                            id="username"
                            class="text-xs opacity-0 group-hover:opacity-100 max-w-[200px] text-primary/75 overflow-hidden text-ellipsis"
                        >
                            {profileData?.id}
                        </h1>
                    </div>

                    <h1 class="text-[0.7rem] text-primary/75">
                        {#if onlineP}
                            {#if profileData.status}
                                {profileData.status}
                            {:else}
                                Online
                            {/if}
                        {:else}
                            Offline
                        {/if}
                    </h1>
                </div>
            </Button>
        </ContextMenuTrigger>

        <ContextMenuContent class="w-[150px]">
            <ContextMenuItem on:click={showProfileModal}
                >View profile</ContextMenuItem
            >

            <ContextMenuSeparator />

            <ContextMenuItem on:click={messageFriend}>Message</ContextMenuItem>
        </ContextMenuContent>
    </ContextMenu>
{/if}
