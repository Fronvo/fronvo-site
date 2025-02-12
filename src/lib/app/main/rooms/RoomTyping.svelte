<script lang="ts">
    import type { FronvoAccount } from 'interfaces/all';
    import { cachedAccountData } from 'stores/main';
    import { ourData } from 'stores/profile';
    import {
        currentChannel,
        currentRoomId,
        currentServer,
        sendContent,
    } from 'stores/rooms';
    import { onDestroy, onMount } from 'svelte';
    import type { Unsubscriber } from 'svelte/motion';
    import { writable, type Writable } from 'svelte/store';
    import { findCachedAccount } from 'utilities/main';

    let unsubscribe: Unsubscriber;
    let typingSent = false;
    let typing: Writable<FronvoAccount[]> = writable([]);
    let tempTyping: string[] = [];

    onMount(() => {
        unsubscribe = sendContent.subscribe((text) => {
            if (text.length == 0) {
                if (!typingSent) return;

                typingSent = false;

                // socket.emit('finishTyping', {
                //     serverId: $currentServer?.serverId,
                //     roomId: $currentChannel?.channelId || $currentRoomId,
                // });
            } else {
                if (typingSent) return;

                typingSent = true;

                // socket.emit('startTyping', {
                //     serverId: $currentServer?.serverId,
                //     roomId: $currentChannel?.channelId || $currentRoomId,
                // });
            }
        });
    });

    // socket.on('typingStarted', async ({ roomId, profileId }) => {
    //     if (tempTyping.includes(profileId)) return;

    //     tempTyping.push(profileId);

    //     if (roomId == ($currentChannel?.channelId || $currentRoomId)) {
    //         if (profileId == $ourData.id) return;

    //         $typing.push(
    //             await findCachedAccount(profileId, $cachedAccountData),
    //         );

    //         $typing = $typing;
    //     }
    // });

    // socket.on('typingEnded', async ({ roomId, profileId }) => {
    //     if (roomId == ($currentChannel?.channelId || $currentRoomId)) {
    //         if (profileId == $ourData.id) return;

    //         const account = await findCachedAccount(
    //             profileId,
    //             $cachedAccountData,
    //         );

    //         // Might have missed the start event
    //         if ($typing.includes(account)) {
    //             $typing.splice($typing.indexOf(account), 1);
    //             $typing = $typing;

    //             tempTyping.splice(tempTyping.indexOf(profileId), 1);
    //         }
    //     }
    // });

    onDestroy(() => unsubscribe());
</script>

<div
    class="flex w-full ml-10 items-center translate-y-[-6px] opacity-0"
    class:opacity-100={$typing.length > 0}
>
    <div class="flex items-center">
        {#each $typing as { id, username, avatar }, i}
            <!-- Up to 4 avatars -->
            {#if i < 3}
                <img
                    src={avatar
                        ? `${avatar}/tr:w-32:h-32`
                        : '/images/avatar.svg'}
                    draggable={false}
                    alt={`${id}\'s avatar'`}
                    class={`${
                        !avatar &&
                        'bg-primary border-accent border-[1px] p-[2px]'
                    } w-[16px] h-[16px] rounded-full mr-1`}
                    class:ml-1={i !== 0}
                />

                <h1 class="text-xs font-medium">
                    {username}{$typing.length > 1 && i != $typing.length - 1
                        ? ','
                        : ''}
                </h1>
            {/if}
        {/each}
    </div>

    <h1 class="text-xs ml-[2.5px]">
        {$typing.length !== 1 ? 'are' : 'is'} typing...
    </h1>
</div>
