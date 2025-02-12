<script lang="ts">
    import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
</script>

<div class="mt-2 mb-2 ml-4">
    <div class="flex mb-3">
        <Skeleton
            class="h-[36px] w-[36px] rounded-full mr-2 mt-4 animate-none"
        />

        <div>
            <Skeleton
                class="h-[15px] w-[100px] rounded-full mr-2 mb-1 animate-none"
            />
            <Skeleton
                class="h-[30px] w-[250px] rounded-full mr-2 animate-none"
            />
        </div>
    </div>

    <div class="flex">
        <Skeleton
            class="h-[36px] w-[36px] rounded-full mr-2 mt-4 animate-none"
        />

        <div>
            <Skeleton
                class="h-[15px] w-[100px] rounded-full mr-2 mb-1 animate-none"
            />
            <Skeleton
                class="h-[200px] w-[150px] rounded-md mr-2 animate-none"
            />
        </div>
    </div>
</div>
