<script lang="ts">
    import Dm from './DM.svelte';
    import { dmsList } from 'stores/rooms';
    import PropRoom from '../rooms/PropRoom.svelte';
    import { isMobile } from 'stores/main';
</script>

<div
    class={`select-none w-[235px] m-auto pl-[5px] pr-[10px] pb-[5px] overflow-x-hidden ${
        $isMobile ? 'w-full m-0 mt-[10px]' : ''
    }`}
>
    <h1
        class="text-[0.8rem] font-medium tracking-wide ml-1 mb-1"
        class:pl-2={$isMobile}
        class:pb-2={$isMobile}
    >
        Messages
    </h1>

    {#if $dmsList.length == 0}
        {#each { length: $isMobile ? 5 : 10 } as _, i}
            <PropRoom />
        {/each}
    {:else}
        {#each $dmsList as dm}
            <Dm dmData={dm} />
        {/each}
    {/if}
</div>
