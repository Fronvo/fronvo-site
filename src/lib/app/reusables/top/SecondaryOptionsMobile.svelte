<script lang="ts">
    import { goto } from '$app/navigation';
    import Button from '$lib/components/ui/button/button.svelte';
    import { activeDashboardTab } from 'stores/dashboard';
    import { ourData } from 'stores/profile';
    import {
        currentRoomData,
        currentRoomId,
        currentRoomLoaded,
        pendingChannelId,
        pendingProfileDMId,
        pendingServerId,
    } from 'stores/rooms';
    import { onMount } from 'svelte';
    import { DashboardOptions } from 'types/all';

    function changeToHome(): void {
        changeTab(DashboardOptions.Home);

        goto('/home');
    }

    function changeToFriends(): void {
        changeTab(DashboardOptions.Friends);

        goto('/friends');
    }

    function changeToProfile(): void {
        changeTab(DashboardOptions.Profile);

        goto('/profile');
    }

    function changeToMessages(): void {
        changeTab(DashboardOptions.Messages);

        goto('/messages');
    }

    function changeTab(tab: DashboardOptions): void {
        $activeDashboardTab = tab;

        $currentRoomId = undefined;
        $currentRoomData = undefined;
        $currentRoomLoaded = false;
    }

    onMount(() => {
        if ($pendingProfileDMId || $pendingServerId || $pendingChannelId)
            return;

        if ($activeDashboardTab == DashboardOptions.Home) {
            goto('/home');
        } else if ($activeDashboardTab == DashboardOptions.Friends) {
            goto('/friends');
        } else if ($activeDashboardTab == DashboardOptions.Profile) {
            goto('/profile');
        } else if ($activeDashboardTab == DashboardOptions.Messages) {
            goto('/messages');
        } else {
            goto('/home');
        }
    });
</script>

<div class="fixed bottom-0 w-full flex z-10 bg-accent">
    <Button
        variant="outline"
        size="lg"
        on:click={changeToHome}
        class={`flex text-center justify-center border-r-0 p-6 w-[25%] rounded-none ${
            $activeDashboardTab == DashboardOptions.Home && !$currentRoomData
                ? 'bg-accent border-accent'
                : ''
        }`}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            class="w-[28px] h-[28px]"
            ><path
                fill="currentColor"
                d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1"
            /></svg
        >
    </Button>

    <Button
        variant="outline"
        size="lg"
        on:click={changeToMessages}
        class={`flex text-center justify-center border-r-0 border-l-0 p-6 w-[25%] rounded-none ${
            $activeDashboardTab == DashboardOptions.Messages &&
            !$currentRoomData
                ? 'bg-accent border-accent'
                : ''
        }`}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            class="w-[24px] h-[24px]"
            ><path
                fill="currentColor"
                d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12c0 1.6.376 3.112 1.043 4.453c.178.356.237.763.134 1.148l-.595 2.226a1.3 1.3 0 0 0 1.591 1.592l2.226-.596a1.63 1.63 0 0 1 1.149.133A9.96 9.96 0 0 0 12 22"
            /></svg
        >
    </Button>

    <Button
        variant="outline"
        size="lg"
        on:click={changeToFriends}
        class={`flex text-center justify-center border-r-0 border-l-0 p-6 w-[25%] rounded-none ${
            $activeDashboardTab == DashboardOptions.Friends && !$currentRoomData
                ? 'bg-accent border-accent'
                : ''
        }`}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            class="w-[28px] h-[28px]"
            ><path
                fill="currentColor"
                d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 6v-.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2v.8q0 .825-.587 1.413T18 20H6q-.825 0-1.412-.587T4 18"
            /></svg
        >
    </Button>

    <Button
        variant="outline"
        size="lg"
        on:click={changeToProfile}
        class={`flex text-center justify-center border-l-0 p-6 w-[25%] rounded-none select-none ${
            $activeDashboardTab == DashboardOptions.Profile && !$currentRoomData
                ? 'bg-accent border-accent'
                : ''
        }`}
    >
        <img
            src={`${
                $ourData.avatar
                    ? `${$ourData.avatar}/tr:w-46:h-46`
                    : '/images/avatar.svg'
            }`}
            draggable={false}
            alt={`${$ourData.id}\'s avatar'`}
            class={`${
                !$ourData.avatar && 'p-[2px]'
            } min-w-[28px] w-[28px] h-[28px] rounded-full mr-2 -translate-x-[1px]`}
            class:bg-primary={!$ourData.avatar}
        />
    </Button>
</div>
