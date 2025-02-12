<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';
    import { isInServer } from 'stores/rooms';
    import { goHome } from 'utilities/rooms';
</script>

<Button
    size="icon"
    variant="outline"
    class={`${
        !$isInServer && 'bg-accent border-accent'
    } select-none w-[48px] h-[48px] rounded-full p-2 mb-1 mt-2`}
    on:click={goHome}
>
    <img src="/fronvo.svg" alt="Fronvo logo" />
</Button>
