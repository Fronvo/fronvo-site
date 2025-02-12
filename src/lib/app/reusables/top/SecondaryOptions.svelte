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
    function changeToDashboard(): void {
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
        } else {
            goto('/home');
        }
    });
</script>

<div class="flex flex-col p-[5px] mt-[5px] select-none">
    <Button
        variant="outline"
        size="lg"
        on:click={changeToDashboard}
        class={`flex text-start justify-start pl-4 mb-2 ${
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
            class="w-[20px] h-[20px] mr-2"
            ><path
                fill="currentColor"
                d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1"
            /></svg
        >

        <h1>Homepage</h1></Button
    >

    <Button
        variant="outline"
        size="lg"
        on:click={changeToProfile}
        class={`flex text-start justify-start pl-4 mb-2 ${
            $activeDashboardTab == DashboardOptions.Profile && !$currentRoomData
                ? 'bg-accent border-accent'
                : ''
        }`}
    >
        <img
            src={`${
                $ourData.avatar
                    ? `${$ourData.avatar}/tr:w-40:h-40`
                    : '/images/avatar.svg'
            }`}
            draggable={false}
            alt={`${$ourData.id}\'s avatar'`}
            class={`${
                !$ourData.avatar && 'p-[2px]'
            } min-w-[20px] w-[20px] h-[20px] rounded-full mr-2`}
            class:bg-primary={!$ourData.avatar}
        />

        <h1 class="max-w-[200px] overflow-hidden text-ellipsis">
            {$ourData?.username}
        </h1></Button
    >

    <Button
        variant="outline"
        size="lg"
        on:click={changeToFriends}
        class={`flex text-start justify-start pl-4 pr-2 mb-2 ${
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
            class="w-[20px] h-[20px] mr-2"
            ><path
                fill="currentColor"
                d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 6v-.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2v.8q0 .825-.587 1.413T18 20H6q-.825 0-1.412-.587T4 18"
            /></svg
        >

        <h1 class="flex-1">Friends</h1>

        {#if $ourData.pending_friend_requests.length > 0}
            <div
                class="pr-1.5 pl-1.5 pt-[1px] pb-[1px] bg-destructive text-white font-black text-xs rounded-full ml-2"
            >
                {$ourData.pending_friend_requests.length}
            </div>
        {/if}
    </Button>
</div>
