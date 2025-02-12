<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';
    import { ChatBubble, ChevronLeft, ChevronRight } from 'radix-icons-svelte';
    import { isMobile } from 'stores/main';
    import {
        currentChannel,
        currentRoomData,
        currentRoomId,
        currentRoomLoaded,
        dmsShowProfile,
        isInServer,
        mobileShowMembers,
    } from 'stores/rooms';

    function goBack(): void {
        $currentRoomId = undefined;
        $currentRoomData = undefined;
        $currentRoomLoaded = false;
        $currentChannel = undefined;
    }

    function toggleProfileview(): void {
        $dmsShowProfile = !$dmsShowProfile;
    }

    function toggleMembersView(): void {
        $mobileShowMembers = true;
    }
</script>

<div
    class={`flex w-full ${!$currentRoomId ? 'empty' : ''} ${
        $isMobile ? 'mobile' : ''
    }`}
>
    <div class="flex w-full border-b h-[45px] items-center pl-3">
        {#if $isMobile}
            <Button
                size="icon"
                variant="outline"
                class="w-[32px] h-[32px] mr-2 z-10 rounded-full"
                on:click={goBack}
            >
                <ChevronLeft size={20} />
            </Button>
        {/if}

        {#if !$isInServer}
            <img
                src={$currentRoomData?.dmUser.avatar
                    ? `${$currentRoomData.dmUser.avatar}/tr:w-32:h-32`
                    : '/images/avatar.svg'}
                draggable={false}
                alt="Avatar"
                class={`w-[28px] h-[28px] rounded-full select-none ${
                    !$currentRoomData?.dmUser.avatar &&
                    'bg-primary border-accent border-[1px] p-[1px]'
                }`}
            />
        {:else}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                class="w-[18px] h-[18px] ml-1.5"
                ><path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M10.723 3.2a.75.75 0 1 0-1.446-.4L7.763 8.25H4a.75.75 0 1 0 0 1.5h3.347l-1.528 5.5H2a.75.75 0 0 0 0 1.5h3.402L4.277 20.8a.75.75 0 0 0 1.446.4l1.236-4.45h7.443l-1.125 4.05a.75.75 0 0 0 1.446.4l1.236-4.45H20a.75.75 0 1 0 0-1.5h-3.624l1.527-5.5H22a.75.75 0 0 0 0-1.5h-3.68l1.403-5.05a.75.75 0 1 0-1.446-.4l-1.514 5.45H9.32zm4.096 12.05l1.528-5.5H8.903l-1.527 5.5z"
                    clip-rule="evenodd"
                /></svg
            >
        {/if}

        <h1 class="text-sm ml-1.5 flex-1">
            {$currentChannel?.name ||
                $currentRoomData?.dmUser.username ||
                'Deleted user'}
        </h1>

        {#if !$isMobile}
            {#if !$isInServer}
                <Button
                    size="icon"
                    variant="ghost"
                    on:click={toggleProfileview}
                    class="mr-2"
                >
                    {#if $dmsShowProfile}
                        <ChevronRight />
                    {:else}
                        <ChevronLeft />
                    {/if}
                </Button>
            {/if}
        {:else if $isInServer}
            <Button
                size="icon"
                variant="outline"
                class="w-[32px] h-[32px] mr-2 z-10 rounded-full"
                on:click={toggleMembersView}
            >
                <ChevronRight size={20} />
            </Button>
        {/if}
    </div>
</div>
