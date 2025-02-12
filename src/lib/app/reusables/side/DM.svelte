<script lang="ts">
    import { goto } from '$app/navigation';
    import Button from '$lib/components/ui/button/button.svelte';
    import {
        ContextMenu,
        ContextMenuContent,
        ContextMenuItem,
        ContextMenuSeparator,
        ContextMenuTrigger,
    } from '$lib/components/ui/context-menu';
    import type { FronvoAccount, Room } from 'interfaces/all';
    import { isMobile } from 'stores/main';
    import { targetProfileModal, viewingProfile } from 'stores/modals';
    import { ourData } from 'stores/profile';
    import {
        currentChannel,
        currentRoomData,
        currentRoomId,
        currentRoomLoaded,
        currentRoomMessages,
        dmsFilter,
        dmsList,
    } from 'stores/rooms';
    import { onDestroy, onMount } from 'svelte';
    import type { Unsubscriber } from 'svelte/store';
    import { setTitle } from 'utilities/main';
    import { goHome } from 'utilities/rooms';
    import Indicator from '../all/Indicator.svelte';

    export let dmData: Room;

    let onlineP = false;
    let dmUser: FronvoAccount;

    let unsubscribe: Unsubscriber;

    async function enterRoom(): Promise<void> {
        if ($currentRoomId == dmData.roomId) return;

        $currentRoomData = dmData;
        $currentRoomLoaded = false;
        $currentRoomLoaded = true;
        $currentRoomMessages = [];
        $currentRoomId = dmData.roomId;

        setTitle(`${dmUser.id ? `@${dmUser.id}` : 'Deleted user'}`);

        // Non-deleted users
        if (dmUser.id) {
            goto(`/@${dmUser.id}`);
        }

        dmData.unreadCount = 0;
    }

    function viewProfile(): void {
        $targetProfileModal = dmData.dmUser;
        $viewingProfile = true;
    }

    function closeDM(): void {
        if ($currentRoomData == dmData) goHome();

        // socket.emit('closeDM', {
        //     roomId: dmData.roomId,
        // });

        $dmsList.splice($dmsList.indexOf(dmData), 1);
        $dmsList = $dmsList;
    }

    onMount(async () => {
        dmUser = dmData.dmUser;
        onlineP = dmUser.online;

        // socket.on('onlineStatusUpdated', async ({ profileId, online }) => {
        //     if (dmUser.profileId == profileId) {
        //         dmUser.online = online;
        //         onlineP = online;

        //         dmUser = dmUser;
        //     }
        // });

        // socket.on(
        //     'profileDataUpdated',
        //     async ({ profileId, username, avatar }) => {
        //         if (dmUser.profileId == profileId) {
        //             dmUser.username = username;
        //             dmUser.avatar = avatar;

        //             dmData = dmData;
        //         }
        //     },
        // );

        // socket.on('profileStatusUpdated', ({ profileId, status }) => {
        //     if (dmUser.profileId == profileId) {
        //         dmUser.status = status;

        //         dmUser = dmUser;
        //     }
        // });

        // socket.on('newMessage', ({ roomId, newMessageData }) => {
        //     // Dont add unreads if were in already
        //     if (
        //         $currentRoomId == roomId ||
        //         $currentChannel?.channelId == roomId
        //     )
        //         return;

        //     if (roomId == dmData.roomId) {
        //         if (
        //             newMessageData.profileData.profileId != $ourData.profileId
        //         ) {
        //             dmData.unreadCount += 1;

        //             new Notification(`${newMessageData.profileData.username}`, {
        //                 body: newMessageData.message.content,
        //                 icon: newMessageData.profileData.avatar
        //                     ? `${newMessageData.profileData.avatar}/tr:w-256:h-256:r-max`
        //                     : '/favicon.png',
        //             });
        //         }

        //         dmData = dmData;
        //     }
        // });

        unsubscribe = dmsList.subscribe(() => {
            if ($currentRoomId == dmData.roomId) {
                dmData.unreadCount = 0;
            }

            setTimeout(() => {
                dmUser = dmData.dmUser;
                onlineP = dmUser.online;
            }, 0);
        });
    });

    onDestroy(() => {
        if (unsubscribe) unsubscribe();
    });

    $: dmData.unreadCount =
        $currentRoomData != dmData.roomId ? dmData.unreadCount : 0;
</script>

{#if dmUser}
    {#if $dmsFilter.trim().length == 0 || dmUser.username
            ?.toLowerCase()
            .includes($dmsFilter
                    .trim()
                    .toLowerCase()) || dmUser.id?.includes($dmsFilter
                .trim()
                .toLowerCase())}
        <ContextMenu>
            <ContextMenuTrigger class="mb-1">
                <Button
                    variant="ghost"
                    class={`select-none group duration-0 h-[40px] text-start pl-2 pr-2 w-[209px] ${
                        $currentRoomId == dmData.roomId
                            ? 'bg-accent border-accent'
                            : ''
                    } ${dmData.unreadCount != 0 ? 'unread' : ''} ${
                        $isMobile ? 'mobile' : ''
                    }`}
                    on:click={enterRoom}
                    on:keydown={enterRoom}
                >
                    <div class="flex items-center">
                        <img
                            id="avatar"
                            src={dmUser?.avatar
                                ? `${dmUser?.avatar}/tr:w-64:h-64`
                                : '/images/avatar.svg'}
                            alt={`${dmUser?.username}\'s avatar'`}
                            draggable={false}
                            class={`${
                                !dmUser.avatar &&
                                'bg-primary border-accent border-[1px] p-[3px]'
                            } w-[28px] h-[28px] rounded-full`}
                        />

                        <Indicator online={onlineP} translateY={10} />
                    </div>

                    <div class="flex flex-col flex-1 -translate-x-1">
                        <h1
                            class={`${
                                dmData.unreadCount > 0
                                    ? 'max-w-[95px] font-semibold'
                                    : 'max-w-[125px]'
                            } text-ellipsis overflow-hidden`}
                        >
                            {dmUser?.username
                                ? dmUser.username
                                : 'Deleted user'}
                        </h1>

                        {#if onlineP && dmUser.status}
                            <h1 class="text-xs text-primary/75 text-[0.69rem]">
                                {dmUser.status}
                            </h1>
                        {/if}
                    </div>

                    {#if dmData.unreadCount > 0 && $currentRoomId != dmData.roomId}
                        <h1
                            class="text-xs border rounded-full p-1 pl-2 pr-2 bg-primary text-accent font-black"
                        >
                            {dmData.unreadCount < 10
                                ? dmData.unreadCount
                                : '9+'}
                        </h1>
                    {/if}
                </Button>
            </ContextMenuTrigger>
            <ContextMenuContent class="w-[150px]">
                {#if dmUser?.id}
                    <ContextMenuItem on:click={viewProfile}
                        >View profile</ContextMenuItem
                    >

                    <ContextMenuSeparator />
                {/if}

                <ContextMenuItem on:click={closeDM}>Close DM</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    {/if}
{/if}
