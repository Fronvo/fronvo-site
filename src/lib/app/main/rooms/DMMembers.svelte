<script lang="ts">
    import { currentRoomData, dmsShowProfile } from 'stores/rooms';
    import DmMutuals from './DMMutuals.svelte';
    import PreviewSmall from '$lib/app/reusables/all/PreviewSmall.svelte';
</script>

{#if $currentRoomData?.dmUser && $dmsShowProfile}
    <div class="flex flex-col items-center w-[275px] h-screen pt-4 border-l">
        <PreviewSmall profileData={$currentRoomData?.dmUser} />

        <!-- Deleted users -->
        {#if $currentRoomData?.dmUser.id}
            <DmMutuals />
        {/if}
    </div>
{/if}
