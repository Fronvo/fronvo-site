<script lang="ts">
    export let online = false;
    export let size: 'sm' | 'lg' = 'sm';

    export let width = size === 'sm' ? 12 : 36;
    export let height = size === 'sm' ? 12 : 36;
    export let translateX = size === 'sm' ? -12 : -24;
    export let translateY = size === 'sm' ? 12 : 24;
    export let borderWidth = size === 'sm' ? 2 : 6;
    export let fixed = false;
</script>

<div
    class={`${
        online ? 'bg-online border-background' : 'bg-offline border-background'
    } flex items-center rounded-full translate-x-[-12px] translate-y-[14px]`}
    style={`border-width: ${borderWidth}px; width: ${width}px; height: ${height}px; transform: translateX(${translateX}px) translateY(${translateY}px)`}
    class:fixed
>
    {#if !online}
        <div
            class="bg-background rounded-full m-auto"
            style={`width: ${size === 'sm' ? width / 3 : 12}px; height: ${
                size === 'sm' ? width / 3 : 12
            }px`}
        />
    {/if}
</div>
