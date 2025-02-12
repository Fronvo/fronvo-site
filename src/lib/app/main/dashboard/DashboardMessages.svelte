<script lang="ts">
    import { fade } from 'svelte/transition';
    import { sineInOut } from 'svelte/easing';
    import MessagesList from '$lib/app/reusables/side/MessagesList.svelte';
    import ServersList from '$lib/app/reusables/side/ServersList.svelte';
    import { isInServer } from 'stores/rooms';
    import ServerPanel from '$lib/app/reusables/side/ServerPanel.svelte';
</script>

<div
    class="main-containe flex h-screen"
    in:fade={{ duration: 200, easing: sineInOut }}
>
    <ServersList />

    {#if !$isInServer}
        <MessagesList />
    {:else}
        <ServerPanel />
    {/if}
</div>
