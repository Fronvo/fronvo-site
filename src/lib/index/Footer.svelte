<script lang="ts">
    import Separator from '$lib/components/ui/separator/separator.svelte';

    export let fixed = false;
</script>

<div
    class={`${
        fixed ? 'fixed bottom-0 right-0 left-0' : ''
    }bg-background m-auto w-full pr-0 pl-0 h-[64px] max-h-[64px] p-4 select-none`}
>
    <Separator />

    <div class="flex items-center justify-center pt-2 pb-2">
        <h1 class="mobile:text-sm font-medium text-sm">
            © Stamatis Tsagkliotis 2025 | Much ♥ to
            <a href="https://ui.shadcn.com" target="_blank"> shadcn </a>
        </h1>
    </div>
</div>
