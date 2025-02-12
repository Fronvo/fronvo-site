<script>
    import { currentChannel, currentRoomData, isInServer } from 'stores/rooms';

    const isDM = typeof $currentRoomData?.dmUser === 'object' && !$isInServer;
    const dmUser = $currentRoomData?.dmUser;
</script>

<div class="ml-6 h-full flex flex-col justify-end">
    {#if !isDM}
        <div class="p-4 bg-border/50 border rounded-full w-max">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                class="w-[32px] h-[32px]"
                ><path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M10.723 3.2a.75.75 0 1 0-1.446-.4L7.763 8.25H4a.75.75 0 1 0 0 1.5h3.347l-1.528 5.5H2a.75.75 0 0 0 0 1.5h3.402L4.277 20.8a.75.75 0 0 0 1.446.4l1.236-4.45h7.443l-1.125 4.05a.75.75 0 0 0 1.446.4l1.236-4.45H20a.75.75 0 1 0 0-1.5h-3.624l1.527-5.5H22a.75.75 0 0 0 0-1.5h-3.68l1.403-5.05a.75.75 0 1 0-1.446-.4l-1.514 5.45H9.32zm4.096 12.05l1.528-5.5H8.903l-1.527 5.5z"
                    clip-rule="evenodd"
                /></svg
            >
        </div>
    {:else}
        <img
            src={dmUser.avatar
                ? `${dmUser.avatar}/tr:w-128:h-128`
                : `/images/avatar.svg`}
            draggable={false}
            class={`${
                !dmUser.avatar
                    ? 'bg-primary border-accent border-[1px] p-[3px]'
                    : ''
            } bg-accent/50 min-w-[64px] w-[64px] h-[64px] rounded-full flex self-start select-none`}
            alt="Avatar"
        />
    {/if}

    <h1 class="text-xl mt-2 font-bold">
        {#if isDM}
            {dmUser?.username || 'Deleted user'}
        {:else}
            #{$currentChannel?.name}
        {/if}
    </h1>

    <h1 class="text-[0.8rem] mt-1 text-card-foreground/75 select-none">
        This is the start of {isDM ? 'this DM' : `${$currentChannel?.name}`}.
    </h1>
</div>
