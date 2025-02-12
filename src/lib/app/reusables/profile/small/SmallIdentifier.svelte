<script lang="ts">
    export let profileId: string;
    export let username: string;
</script>

<div class="w-full flex flex-col ml-10">
    <h1 class="text-xl font-bold">
        {username ? username : 'Deleted user'}
    </h1>

    <h1 class="text-xs translate-y-[-2px] font-medium">
        {profileId ? profileId : 'deleted user'}
    </h1>
</div>
