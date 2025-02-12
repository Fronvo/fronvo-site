<script lang="ts">
    import { scale } from 'svelte/transition';
    import MessagesList from '../reusables/side/MessagesList.svelte';
    import {
        currentChannel,
        currentRoomData,
        currentRoomLoaded,
        isInServer,
        mobileShowMembers,
    } from 'stores/rooms';
    import { disconnected, isMobile } from 'stores/main';
    import HomeButton from '../reusables/top/HomeButton.svelte';
    import CreateServerButton from '../reusables/side/CreateServerButton.svelte';
    import SecondaryOptions from '../reusables/top/SecondaryOptions.svelte';
    import { quintInOut } from 'svelte/easing';
    import ServersList from '../reusables/side/ServersList.svelte';
    import RoomChat from './rooms/RoomChat.svelte';
    import RoomSend from './rooms/RoomSend.svelte';
    import RoomInfo from './rooms/RoomInfo.svelte';
    import DmMembers from './rooms/DMMembers.svelte';
    import RoomMembers from './rooms/RoomMembers.svelte';
    import ServerPanel from '../reusables/side/ServerPanel.svelte';
    import Dashboard from './dashboard/Dashboard.svelte';
    import JoinServerButton from '../reusables/side/JoinServerButton.svelte';
    import RoomTyping from './rooms/RoomTyping.svelte';
    import SecondaryOptionsMobile from '../reusables/top/SecondaryOptionsMobile.svelte';
    import ThemeToggle from '$lib/components/ThemeToggle.svelte';
    import Sonner from '$lib/components/ui/sonner/sonner.svelte';
    import DisconnectedButton from '../reusables/side/DisconnectedButton.svelte';
</script>

<Sonner />

<div
    class={`flex overflow-hidden ${$isMobile ? 'min-w-none' : ''}`}
    in:scale={{ duration: 750, easing: quintInOut, opacity: 0, start: 1.25 }}
>
    {#if !$mobileShowMembers}
        {#if !$isMobile}
            <div
                class="[&::-webkit-scrollbar]:hidden w-[64px] min-w-[64px] h-screen flex flex-col items-center z-10 overflow-x-hidden overflow-y-auto pb-[10px]"
            >
                <HomeButton />
                <ServersList />
                <CreateServerButton />
                <JoinServerButton />
                <ThemeToggle useButton />

                {#if $disconnected}
                    <DisconnectedButton />
                {/if}
            </div>

            <div class="h-screen min-w-[235px] flex flex-col items-center z-10">
                {#if !$isInServer}
                    <div
                        class="[&::-webkit-scrollbar]:hidden w-[235px] h-screen overflow-x-hidden border-l border-r pr-2 pl-2"
                    >
                        <SecondaryOptions />

                        <MessagesList />
                    </div>
                {:else}
                    <ServerPanel />
                {/if}
            </div>
        {:else if !$currentChannel && !$currentRoomData}
            <SecondaryOptionsMobile />
        {/if}

        <div class="third-containe flex flex-col items-center w-full h-screen">
            {#if !$isMobile}
                {#if $currentRoomLoaded || $isInServer}
                    {#if $currentRoomData || $currentChannel}
                        <RoomInfo />

                        <RoomChat />

                        <RoomSend />

                        <RoomTyping />
                    {/if}
                {:else}
                    <Dashboard />
                {/if}
            {:else if $currentRoomLoaded || $currentChannel}
                <RoomInfo />

                <RoomChat />

                <RoomSend />

                <RoomTyping />
            {:else}
                <Dashboard />
            {/if}
        </div>

        {#if !$isMobile}
            <div class="fourth-containe flex flex-col z-1">
                {#if $isInServer}
                    <RoomMembers />
                {:else}
                    <DmMembers />
                {/if}
            </div>
        {/if}
    {:else}
        <RoomMembers />
    {/if}
</div>
