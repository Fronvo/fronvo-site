<script>
    import SpotifyController from './SpotifyController.svelte';
    import { ourData } from 'stores/profile';
</script>

{#if $ourData}
    {#if $ourData.hasSpotify}
        <SpotifyController />
    {/if}
{/if}
