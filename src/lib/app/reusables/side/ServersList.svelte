<script lang="ts">
    import { serversList } from 'stores/rooms';
    import Server from './Server.svelte';
    import { disconnected, isMobile } from 'stores/main';
    import CreateServerButton from './CreateServerButton.svelte';
    import JoinServerButton from './JoinServerButton.svelte';
    import HomeButton from '../top/HomeButton.svelte';
    import DisconnectedButton from './DisconnectedButton.svelte';
    import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<div class="flex flex-col" class:mr-2={$isMobile} class:ml-2={$isMobile}>
    {#if $isMobile}
        <HomeButton />
    {/if}

    {#if $serversList.length != 0}
        {#each $serversList as serverData}
            <Server {serverData} />
        {/each}
    {/if}

    {#if $isMobile}
        <CreateServerButton />
        <JoinServerButton />
        <ThemeToggle useButton />

        {#if $disconnected}
            <DisconnectedButton />
        {/if}
    {/if}
</div>
