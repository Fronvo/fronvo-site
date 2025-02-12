<script lang="ts">
    import {
        getCachedMessages,
        getRoomMessages,
        isRoomCached,
        removePendingMessage,
        updateCachedMessages,
    } from 'utilities/rooms';
    import {
        currentRoomId,
        currentRoomData as roomData,
        currentRoomMessages as messages,
        currentRoomLoaded,
        currentServer,
        currentChannel,
        cachedRooms,
        pendingMessages,
    } from 'stores/rooms';
    import { onDestroy, onMount } from 'svelte';
    import { setTitle } from 'utilities/main';
    import { ourData } from 'stores/profile';
    import Message from '$lib/app/reusables/rooms/Message.svelte';
    import { fronvoTitle, isMobile } from 'stores/main';
    import InfiniteLoading from 'svelte-infinite-loading';
    import type { Unsubscriber } from 'svelte/store';
    import PropText from '$lib/app/reusables/rooms/PropText.svelte';
    import RoomChatStart from './RoomChatStart.svelte';

    let chat: HTMLDivElement;
    let unsubscribe: Unsubscriber;
    let canShowScroll = false;
    let previousEmpty = false;
    let hideMessages = true;

    async function loadMore({ detail: { loaded } }): Promise<void> {
        if (previousEmpty) {
            loaded();

            return;
        } else {
            const roomId = $currentChannel?.id || $currentRoomId;
            const serverId = $currentServer?.id;

            // Not cached, load
            if (!isRoomCached(roomId, $cachedRooms)) {
                const msgs = await getRoomMessages(
                    roomId,
                    $messages.length,
                    serverId
                );

                previousEmpty = true;

                // If empty, cache room and set flag for next load
                if (msgs.length == 0) {
                    previousEmpty = true;

                    updateCachedMessages(roomId, msgs, $cachedRooms);

                    loaded();
                } else {
                    // Otherwise update messages and cache, scroll to bottom
                    $messages = msgs.concat($messages);

                    loaded();

                    // Background update cache
                    updateCachedMessages(roomId, $messages, $cachedRooms);

                    setTimeout(() => {
                        hideMessages = false;
                    }, 0);
                }
            } else {
                // load more
                if (
                    getCachedMessages(roomId, $cachedRooms)?.length !=
                        $messages.length + 50 &&
                    $messages.length != 0
                ) {
                    const msgs = await getRoomMessages(
                        roomId,
                        $messages.length,
                        serverId
                    );

                    // If empty, cache room and set flag for next load
                    if (msgs.length == 0) {
                        previousEmpty = true;

                        loaded();
                    } else {
                        // Otherwise update messages and cache, scroll to bottom
                        $messages = msgs.concat($messages);

                        loaded();

                        // Background update cache
                        updateCachedMessages(roomId, $messages, $cachedRooms);

                        setTimeout(() => {
                            hideMessages = false;
                        }, 0);
                    }
                } else {
                    const cachedMessages = getCachedMessages(
                        roomId,
                        $cachedRooms
                    );

                    // In cache, load in place
                    $messages = cachedMessages;

                    if (cachedMessages.length == 0) {
                        previousEmpty = true;
                    }

                    setTimeout(() => {
                        chat.scrollTop = chat.scrollHeight;

                        hideMessages = false;
                    }, 0);
                }
            }
        }
    }

    function attachNewMessageListener(): void {
        document.body.onfocus = () => {
            var link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');

                // @ts-ignore
                link.rel = 'icon';
                document.head.appendChild(link);
            }

            // @ts-ignore
            link.href = '/favicon.png';

            if ($fronvoTitle.includes('(1)')) {
                setTitle($fronvoTitle.replace(`(1)`, ''), true);
            }
        };

        function messageListener({ roomId, newMessageData }): void {
            if ($messages.includes(newMessageData)) return;

            if ($pendingMessages.includes(newMessageData.message.content)) {
                for (const messageIndex in $messages) {
                    let message = $messages[messageIndex];

                    if (
                        message.message.content ==
                        newMessageData.message.content
                    ) {
                        message = {
                            ...message,
                            ...newMessageData,
                        };

                        $messages[messageIndex] = message;

                        removePendingMessage(
                            newMessageData.message.content,
                            $pendingMessages
                        );

                        break;
                    }
                }
            } else if (($currentChannel?.id || $currentRoomId) == roomId) {
                $messages.push(newMessageData);
                $messages = $messages;

                updateCachedMessages(
                    $currentChannel?.id || $currentRoomId,
                    $messages,
                    $cachedRooms
                );

                setTimeout(() => {
                    chat.scrollTo({
                        top: 99999999,
                        behavior: 'smooth',
                    });
                }, 0);

                if (
                    newMessageData.profileData.id != $ourData.id &&
                    !document.hasFocus() &&
                    !$fronvoTitle.includes('(1)')
                ) {
                    setTitle(`(1) ${$fronvoTitle}`, true);
                }
            }
        }

        // socket.on('newMessage', messageListener);
    }

    function attachDeletedMessageListener(): void {
        // socket.on('messageDeleted', ({ messageId, roomId }) => {
        //     if (($currentChannel?.channelId || $currentRoomId) != roomId) {
        //         setTimeout(() => {
        //             // Update cached room data
        //             removeCachedMessage(roomId, messageId, $cachedRooms);
        //         }, 0);
        //         return;
        //     }
        //     for (const messageIndex in $messages) {
        //         const targetMessage = $messages[messageIndex];
        //         if (messageId == $replyingToId) {
        //             $replyingTo = undefined;
        //             $replyingToId = undefined;
        //         }
        //         if (targetMessage.message.messageId == messageId) {
        //             $messages.splice(Number(messageIndex), 1);
        //             $messages = $messages;
        //             if ($messages.length == 0) {
        //                 previousEmpty = false;
        //             }
        //             break;
        //         }
        //     }
        // });
    }

    onMount(() => {
        chat.scrollTop = chat.scrollHeight;

        currentRoomId.subscribe((state) => {
            if (!state) return;

            canShowScroll = false;
            previousEmpty = false;
            hideMessages = true;

            if (!chat) return;

            chat.style.opacity = '0';
        });

        currentChannel.subscribe((state) => {
            if (!state) return;

            canShowScroll = false;
            previousEmpty = false;
            hideMessages = true;

            if (!chat) return;

            chat.style.opacity = '0';
        });

        pendingMessages.subscribe((state) => {
            if (!state) return;

            hideMessages = false;

            setTimeout(() => {
                if (!chat) return;

                chat.scrollTo({
                    top: 99999999,
                    behavior: 'smooth',
                });
            }, 0);
        });

        unsubscribe = currentRoomLoaded.subscribe(async (val) => {
            previousEmpty = false;

            if (!val) return;

            setTimeout(() => {
                if (!chat) return;

                setTimeout(() => {
                    // Load images
                    chat.style.opacity = '1';

                    chat.scrollTop = chat.scrollHeight;
                }, 0);

                canShowScroll = true;
            }, 0);
        });

        attachNewMessageListener();
        attachDeletedMessageListener();
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

{#if $messages}
    <div
        bind:this={chat}
        class={`[&::-webkit-scrollbar]:bg-none [&::-webkit-scrollbar]:w-[10px] ${
            $messages.length > 0 &&
            canShowScroll &&
            '[&::-webkit-scrollbar-thumb]:bg-accent'
        } [&::-webkit-scrollbar-thumb]:rounded-full flex flex-col w-full max-w-full h-screen pb-[20px] pt-[20px] overflow-y-auto overflow-x-hidden opacity-0 z-1 ${
            $isMobile ? 'mobile' : ''
        }`}
    >
        {#if $messages.length == 0 && !previousEmpty}
            <PropText />
            <PropText />
            <PropText />
            <PropText />
        {:else}
            <RoomChatStart />
        {/if}

        {#if $roomData || $currentChannel}
            {#if !previousEmpty && canShowScroll}
                <InfiniteLoading
                    distance={2000}
                    on:infinite={loadMore}
                    direction="top"
                >
                    <div slot="noMore" />
                    <div slot="noResults" />
                    <div slot="error" />
                    <div slot="spinner" />
                </InfiniteLoading>
            {/if}

            {#each $messages as { message, profileData }, i}
                <Message
                    {i}
                    {profileData}
                    messageData={message}
                    hideCondition={hideMessages}
                    isPending={$pendingMessages.includes(message.content) &&
                        i == $messages.length - 1}
                />
            {/each}
        {/if}
    </div>
{/if}
