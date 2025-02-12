<script lang="ts">
    import Input from '$lib/components/ui/input/input.svelte';

    export let profileId: string;
    export let username: string;
    export let editable = false;
</script>

<div class={`flex flex-col mb-4 ${!editable ? 'pr-2 pl-2' : ''}`}>
    {#if !editable}
        <h1 class="text-xl font-bold">
            {username ? username : 'Deleted user'}
        </h1>

        <h1 class="text-xs translate-y-[-2px] font-medium">
            {profileId ? profileId : 'Deleted user'}
        </h1>
    {:else}
        <Input
            class="p-1.5 font-bold text-lg max-w-[200px] z-10"
            bind:value={username}
            placeholder="Username"
            maxlength={30}
        />

        <Input
            class="text-xs mt-2 h-[32px] max-w-[150px]"
            value={profileId}
            disabled
        />
    {/if}
</div>
