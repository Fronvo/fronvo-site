<script lang="ts">
    import type { Server } from 'interfaces/all';
    import { isMobile } from 'stores/main';
    import {
        currentChannel,
        currentRoomData,
        currentRoomId,
        currentRoomLoaded,
        currentRoomMessages,
        currentServer,
        isInServer,
    } from 'stores/rooms';
    import { setTitle } from 'utilities/main';
    import { goto } from '$app/navigation';
    import Button from '$lib/components/ui/button/button.svelte';

    export let serverData: Server;

    async function enterServer(): Promise<void> {
        if ($currentServer?.id == serverData.id) return;

        $isInServer = true;
        $currentServer = serverData;

        if (serverData.channels.length > 0 && !$isMobile) {
            const channel = serverData.channels[0];

            $currentChannel = channel;
            $currentRoomLoaded = false;
            $currentRoomLoaded = true;
            $currentRoomMessages = [];

            goto(
                `/${encodeURIComponent(
                    $currentServer.invite
                )}/${encodeURIComponent(channel.name)}`
            );

            setTitle(`#${channel.name} | ${$currentServer.name}`);
        } else {
            $currentChannel = undefined;
            $currentRoomId = undefined;
            $currentRoomData = undefined;

            $currentRoomMessages = [];

            goto(`/${serverData.invite}`);

            setTitle(serverData.name);
        }
    }
</script>

{#if serverData.avatar}
    <img
        on:click={enterServer}
        on:keydown={enterServer}
        src={`${serverData.avatar}/tr:w-96:h-96`}
        alt={`${serverData.name}\'s icon'`}
        draggable={false}
    />
{:else}
    <Button
        variant="outline"
        class={`select-none w-[48px] h-[48px] rounded-full mt-1 mb-1 ${
            $currentServer?.id == serverData.id ? 'bg-accent border-accent' : ''
        } ${$isMobile ? 'mobile-placeholder' : ''}`}
        on:click={enterServer}
        on:keydown={enterServer}
        id="icon"
    >
        <h1>{serverData.name[0]}{serverData.name[1] || ''}</h1></Button
    >
{/if}
