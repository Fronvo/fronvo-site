<script lang="ts">
    import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
</script>

<div class="mb-3 mt-1 flex p-1">
    <Skeleton class="w-[32px] h-[32px] rounded-full animate-none" />

    <Skeleton
        class="w-[125px] h-[24px] m-auto ml-2 rounded-full animate-none"
    />
</div>
