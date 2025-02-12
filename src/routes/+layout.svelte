<script lang="ts">
    import Main from '$lib/app/main/Main.svelte';
    import { onMount } from 'svelte';
    import { setTitle } from 'utilities/main';
    import '../app.css';
    import FronvoLoading from '$lib/app/FronvoLoading.svelte';
    import {
        cachedAccountData,
        disconnected,
        fronvoTitle,
        isMobile,
        loginSucceeded,
        showLayout,
    } from 'stores/main';
    import { goto } from '$app/navigation';
    import {
        currentServer,
        serversList,
        currentChannel,
        currentRoomLoaded,
        currentRoomId,
        currentRoomData,
        currentRoomMessages,
        isInServer,
        dmsList,
        cachedRooms,
        pendingProfileDMId,
        pendingServerId,
        pendingChannelId,
    } from 'stores/rooms';
    import { ourData } from 'stores/profile';
    import { loadOurPosts } from 'utilities/dashboard';
    import TopNav from '$lib/index/TopNav.svelte';
    import { ModeWatcher } from 'mode-watcher';
    import Footer from '$lib/index/Footer.svelte';
    import ProfileModal from '$lib/app/main/modals/ProfileModal.svelte';
    import StatusModal from '$lib/app/main/modals/StatusModal.svelte';
    import LogoutModal from '$lib/app/main/modals/LogoutModal.svelte';
    import SwitchAccountsModal from '$lib/app/main/modals/SwitchAccountsModal.svelte';
    import AddAccountModal from '$lib/app/main/modals/AddAccountModal.svelte';
    import RequestDataModal from '$lib/app/main/modals/RequestDataModal.svelte';
    import DeleteAccountModal from '$lib/app/main/modals/DeleteAccountModal.svelte';
    import Controllers from '$lib/app/controllers/Controllers.svelte';
    import { io, Socket } from 'socket.io-client';
    import { PUBLIC_FRONVO_API_URL } from '$env/static/public';
    import Cookies from 'js-cookie';
    import type { S2CProfiles } from 'interfaces/profiles/s2c';
    import type { S2CDMs } from 'interfaces/dms/s2c';
    import type { S2CServers } from 'interfaces/servers/s2c';
    import type { Server } from 'interfaces/all';

    let mountReady = false;

    function setupVars(): void {
        const userAgent = window.navigator.userAgent.toLowerCase();

        $isMobile =
            userAgent.includes('android') || userAgent.includes('iphone');
    }

    async function initProfilesSocket() {
        const profilesSocket: Socket<S2CProfiles> = io(
            `${PUBLIC_FRONVO_API_URL}/profiles`,
            {
                transports: ['websocket', 'polling'],
                query: {
                    authorization: Cookies.get('accessToken') as string,
                },
            }
        );

        profilesSocket.on('statusUpdated', ({ status }) => {
            $ourData.status = status;
        });

        profilesSocket.on('postShared', () => {
            loadOurPosts();
        });

        profilesSocket.on('disconnect', () => {
            $disconnected = true;
        });

        profilesSocket.on('connect', () => {
            $disconnected = false;
        });
    }

    async function initDMSSocket() {
        const dmsSocket: Socket<S2CDMs> = io(`${PUBLIC_FRONVO_API_URL}/dms`, {
            transports: ['websocket', 'polling'],
            query: {
                authorization: Cookies.get('accessToken') as string,
            },
        });

        dmsSocket.on('disconnect', () => {
            $disconnected = true;
        });

        dmsSocket.on('connect', () => {
            $disconnected = false;
        });
    }

    async function initServersSocket() {
        const serversSocket: Socket<S2CServers> = io(
            `${PUBLIC_FRONVO_API_URL}/servers`,
            {
                transports: ['websocket', 'polling'],
                query: {
                    authorization: Cookies.get('accessToken') as string,
                },
            }
        );

        function updateServers(server: Server) {
            $serversList = $serversList.map((v) =>
                v.id === server.id ? { ...server } : v
            );
            $serversList = $serversList;

            if ($currentServer.id === server.id) {
                $currentServer = server;

                if ($currentChannel) {
                    goto(
                        `/${encodeURIComponent(
                            server.invite
                        )}/${encodeURIComponent($currentChannel.name)}`
                    );

                    setTitle(`#${$currentChannel.name} | ${server.name}`);
                } else {
                    goto(`/${encodeURIComponent(server.invite)}`);

                    setTitle(server.name);
                }
            }
        }

        serversSocket.on('serverCreated', ({ server }) => {
            $serversList.push(server);
            $serversList = $serversList;

            // Auto-join
            $currentServer = server;
            $isInServer = true;
            $currentChannel = undefined;
            $currentRoomId = undefined;
            $currentRoomData = undefined;

            $currentRoomMessages = [];

            goto(`/${server.invite}`);

            setTitle(server.name);
        });

        serversSocket.on('serverJoined', ({ server }) => {
            $serversList.push(server);
            $serversList = $serversList;

            enterJoinedServer(server.invite);

            // Enter it
            async function enterJoinedServer(
                parsedInvite: string
            ): Promise<void> {
                const targetServer = $serversList.find(
                    (v) => v.invite === parsedInvite
                );

                if ($currentServer?.id == server.id) return;

                $isInServer = true;
                $currentServer = targetServer;

                if (targetServer.channels.length > 0) {
                    const channel = targetServer.channels[0];

                    $currentChannel = channel;
                    $currentRoomLoaded = false;
                    $currentRoomLoaded = true;
                    $currentRoomMessages = [];

                    goto(
                        `/${encodeURIComponent(
                            parsedInvite
                        )}/${encodeURIComponent(channel.name)}`
                    );

                    setTitle(`#${channel.name} | ${$currentServer.name}`);
                } else {
                    $currentChannel = undefined;
                    $currentRoomId = undefined;
                    $currentRoomData = undefined;

                    $currentRoomMessages = [];

                    goto(`/${parsedInvite}`);

                    setTitle(targetServer.name);
                }
            }
        });

        serversSocket.on('serverEdited', ({ server }) => {
            updateServers(server);
        });

        serversSocket.on('serverLeft', ({ id }) => {
            $isInServer = undefined;
            $currentServer = undefined;
            $currentChannel = undefined;
            $currentRoomLoaded = false;
            $currentRoomData = undefined;

            $serversList = $serversList.filter((v) => v.id !== id);
        });

        serversSocket.on('serverDeleted', ({ id }) => {
            $isInServer = undefined;
            $currentServer = undefined;
            $currentChannel = undefined;
            $currentRoomLoaded = false;
            $currentRoomData = undefined;

            $serversList = $serversList.filter((v) => v.id !== id);
        });

        serversSocket.on('inviteRegenerated', ({ server }) => {
            updateServers(server);
        });

        serversSocket.on('inviteToggled', ({ server }) => {
            updateServers(server);
        });

        serversSocket.on('channelCreated', ({ server }) => {
            updateServers(server);
        });

        serversSocket.on('channelEdited', ({ server }) => {
            updateServers(server);
        });

        serversSocket.on('channelDeleted', ({ server, channelId }) => {
            updateServers(server);

            if ($currentChannel?.id === channelId) {
                $currentChannel = undefined;
            }
        });

        serversSocket.on('memberJoined', ({ server }) => {
            updateServers(server);
        });

        serversSocket.on('memberLeft', ({ server }) => {
            updateServers(server);
        });

        serversSocket.on('memberBanned', ({ server }) => {
            updateServers(server);
        });

        serversSocket.on('memberUnbanned', ({ server }) => {
            updateServers(server);
        });

        serversSocket.on('disconnect', () => {
            $disconnected = true;
        });

        serversSocket.on('connect', () => {
            $disconnected = false;
        });
    }

    async function initSockets() {
        // TODO: Make these global stores, prevent re-innitting on code change
        initProfilesSocket();
        initDMSSocket();
        initServersSocket();
    }

    async function setupLayout() {
        // When layout is visible, perform socket actions
        showLayout.subscribe(async (state) => {
            // While loading, default to this
            setTitle('');

            if (state) {
                await initSockets();

                $currentRoomLoaded = false;
                $currentRoomId = undefined;
                $currentRoomData = undefined;
                $currentRoomMessages = [];

                $isInServer = false;
                $currentServer = undefined;
                $currentChannel = undefined;

                // setupHooks();

                loginSucceeded.subscribe((state) => {
                    if (!state) return;

                    Notification.requestPermission();

                    if ($pendingProfileDMId) {
                        for (const dmIndex in $dmsList) {
                            const dm = $dmsList[dmIndex];

                            if (dm.dmUser.id == $pendingProfileDMId) {
                                $currentRoomData = dm;
                                $currentRoomLoaded = false;
                                $currentRoomLoaded = true;
                                $currentRoomMessages = [];
                                $currentRoomId = dm.roomId;

                                setTitle(`@${dm.dmUser.id}`);

                                dm.unreadCount = 0;

                                return;
                            }
                        }
                    } else if ($pendingServerId) {
                        for (const serverIndex in $serversList) {
                            const server = $serversList[serverIndex];

                            if (server.invite == $pendingServerId) {
                                if ($pendingChannelId) {
                                    for (const channelIndex in server.channels) {
                                        const channel =
                                            server.channels[channelIndex];

                                        if (channel.name == $pendingChannelId) {
                                            $currentRoomId = undefined;
                                            $currentRoomData = undefined;

                                            $isInServer = true;
                                            $currentServer = server;
                                            $currentChannel = channel;
                                            $currentRoomLoaded = false;
                                            $currentRoomLoaded = true;
                                            $currentRoomMessages = [];

                                            setTitle(
                                                `#${channel.name} | ${server.name}`
                                            );

                                            return;
                                        }
                                    }

                                    // Invalid channel
                                    $currentChannel = undefined;
                                    $currentRoomId = undefined;
                                    $currentRoomData = undefined;

                                    $isInServer = true;
                                    $currentServer = server;

                                    $currentRoomMessages = [];

                                    goto(`/${server.invite}`, {
                                        replaceState: true,
                                    });

                                    setTitle(server.name);

                                    return;
                                } else {
                                    $currentChannel = undefined;
                                    $currentRoomId = undefined;
                                    $currentRoomData = undefined;

                                    $isInServer = true;
                                    $currentServer = server;

                                    $currentRoomMessages = [];

                                    setTitle(server.name);

                                    return;
                                }
                            }
                        }

                        // Invalid server
                        goto('/profile', {
                            replaceState: true,
                        });

                        setTitle('');
                    }
                });
            }
        });
    }

    function setupHooks(): void {
        // socket.on('newMessage', ({ newMessageData, roomId }) => {
        //     // Not same channel / dm
        //     if (($currentChannel?.channelId || $currentRoomId) != roomId) {
        //         setTimeout(() => {
        //             pushCachedMessage(roomId, newMessageData, $cachedRooms);
        //         }, 0);
        //     }
        // });
        // socket.on('postRemoved', async ({ postId }) => {
        //     for (const postIndex in $ourPosts) {
        //         const post = $ourPosts[postIndex].post;
        //         if (post.postId == postId) {
        //             $ourPosts = [];
        //             await loadOurPosts();
        //             break;
        //         }
        //     }
        // });
        // socket.on('dmCreated', ({ dm }) => {
        //     $dmsList.push(dm);
        //     $dmsList = $dmsList;
        // });
        // // Can't be us, another client on the same profile
        // socket.on('dmHidden', ({ roomId }) => {
        //     for (const dmIndex in $dmsList) {
        //         const dm = $dmsList[dmIndex];
        //         if (dm.roomId == roomId) {
        //             $dmsList.splice(Number(dmIndex), 1);
        //             $dmsList = $dmsList;
        //             break;
        //         }
        //     }
        // });
        // socket.on('pendingFriendRemoved', ({ profileId }) => {
        //     $ourData.pending_friend_requests.splice(
        //         $ourData.pending_friend_requests.indexOf(profileId),
        //         1,
        //     );
        //     $ourData = $ourData;
        // });
        // socket.on('newFriendRequest', async ({ profileId }) => {
        //     $ourData.pending_friend_requests.push(profileId);
        //     $ourData = $ourData;
        //     const icon = `${
        //         (await findCachedAccount(profileId, $cachedAccountData)).avatar
        //     }/tr:w-256:h-256:r-max`;
        //     new Notification(`@${profileId}`, {
        //         body: 'New friend request',
        //         icon,
        //     });
        // });
        // socket.on('connectionsUpdated', ({ profileId, spotify, github }) => {
        //     if (profileId == $ourData.id) {
        //         $ourData = {
        //             ...$ourData,
        //             ...spotify,
        //             ...github,
        //         };
        //         $ourData = $ourData;
        //     } else {
        //         for (const cachedAccountIndex in $cachedAccountData) {
        //             const account = $cachedAccountData[cachedAccountIndex];
        //             if (account.id == profileId) {
        //                 $cachedAccountData[cachedAccountIndex] = {
        //                     ...$cachedAccountData[cachedAccountIndex],
        //                     ...spotify,
        //                     ...github,
        //                 };
        //                 $cachedAccountData = $cachedAccountData;
        //                 break;
        //             }
        //         }
        //     }
        // });
    }

    onMount(() => {
        mountReady = true;

        setupVars();
        setupLayout();
    });
</script>

<svelte:head>
    <title>{$fronvoTitle}</title>
</svelte:head>

<ModeWatcher />
<Controllers />

<ProfileModal />
<StatusModal />
<SwitchAccountsModal />
<AddAccountModal />
<LogoutModal />
<RequestDataModal />
<DeleteAccountModal />

<div>
    {#if mountReady}
        {#if $showLayout}
            {#if $loginSucceeded === undefined}
                <FronvoLoading />
            {:else}
                <Main />
            {/if}
        {:else}
            <TopNav />

            <Footer fixed />
        {/if}

        <slot />
    {/if}
</div>
