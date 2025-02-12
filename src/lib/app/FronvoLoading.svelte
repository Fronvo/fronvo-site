<script>
    import { onMount } from 'svelte';
    import { fade, scale } from 'svelte/transition';

    let mountReady = false;

    onMount(() => {
        mountReady = true;
    });
</script>

{#if mountReady}
    <div out:scale={{ duration: 1000 }}>
        <img
            in:scale={{ duration: 400, start: 2.5, opacity: 1 }}
            src={'/fronvo.svg'}
            alt="Fronvo Logo"
            class="w-[120px] h-[120px] m-auto fixed right-0 left-0 top-0 bottom-0"
        />

        <h1
            class="fixed bottom-4 right-0 left-0 m-auto w-max font-medium"
            in:fade={{ duration: 250 }}
        >
            By Fronvo
        </h1>
    </div>
{/if}
