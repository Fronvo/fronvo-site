<script lang="ts">
    import { currentServer, mobileShowMembers } from 'stores/rooms';
    import { isMobile } from 'stores/main';
    import RoomMember from '$lib/app/reusables/rooms/RoomMember.svelte';
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import { ChevronLeft } from 'radix-icons-svelte';

    function goBack(): void {
        $mobileShowMembers = false;
    }
</script>

<div
    class={`w-[240px] h-screen border-l`}
    class:pt-4={!$isMobile}
    class:pt-1={$isMobile}
    class:w-full={$isMobile}
>
    <div class="flex items-center">
        {#if $isMobile}
            <Button
                size="icon"
                variant="outline"
                class="w-[32px] h-[32px] mr-2 z-10 rounded-full ml-2"
                on:click={goBack}
            >
                <ChevronLeft size={20} />
            </Button>
        {/if}

        <h1
            class="text-xs uppercase font-bold pt-1 select-none"
            class:pl-2={!$isMobile}
        >
            Members
        </h1>
    </div>

    <Separator class="mt-2 mb-1" />

    <div class="flex flex-col items-center pr-2 pl-2">
        {#each $currentServer?.members as profileData}
            <RoomMember {profileData} />
        {/each}
    </div>
</div>
