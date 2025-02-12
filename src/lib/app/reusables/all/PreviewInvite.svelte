<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';
    import { dmsList } from 'stores/rooms';
    import { findAccountDMId } from 'utilities/rooms';

    export let avatar: string;
    export let profileId: string;
    export let invite: string;
    export let isInServer: boolean;
    export let isBanned: boolean;

    let invited = false;

    async function inviteFriend(): Promise<void> {
        if (invited) return;

        invited = true;

        // // TODO: V3 server invite type message
        // socket.emit('sendMessage', {
        //     roomId: await findAccountDMId(profileId, $dmsList),
        //     message: `/invite/${invite}`,
        // });
    }
</script>

<div class="flex items-center mb-3 w-[95%] m-auto">
    <img
        src={avatar ? `${avatar}/tr:w-56:h-56` : '/images/avatar.svg'}
        alt={`${profileId}'s avatar`}
        draggable={false}
        class={`${
            !avatar && 'bg-primary border-accent border-[1px] p-[3px]'
        } w-[28px] h-[28px] mr-2 rounded-full`}
    />

    <h1 class="text-sm font-medium max-w-[200px] overflow-hidden text-ellipsis">
        {profileId}
    </h1>

    <span class="flex-1" />

    <Button
        size="sm"
        disabled={invited || isBanned || isInServer}
        id="invite"
        on:click={inviteFriend}
        variant={`${isBanned ? 'destructive' : 'default'}`}
    >
        {#if isInServer}
            Already in server
        {:else if isBanned}
            Banned
        {:else if invited}
            Invite sent
        {:else}
            Invite
        {/if}
    </Button>
</div>
