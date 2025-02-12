<script>
    import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
</script>

<div>
    <div class="flex mb-3 text-start">
        <Skeleton class="w-[36px] h-[36px] rounded-full animate-none" />
        <Skeleton class="w-[200px] h-[24px] m-auto ml-2 animate-none" />
    </div>

    <Skeleton class="w-[500px] h-[350px] mb-2 animate-none" />

    <div class="flex mb-2 text-start w-full">
        <Skeleton
            class="w-[32px] h-[32px] mb-4 rounded-full self-start ml-2 animate-none"
        />
        <Skeleton class="w-[100px] h-[24px] ml-2 mt-1 animate-none" />
    </div>
</div>
