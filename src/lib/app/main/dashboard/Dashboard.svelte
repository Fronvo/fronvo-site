<script lang="ts">
    import { activeDashboardTab, totalDashboardPosts } from 'stores/dashboard';
    import { DashboardOptions } from 'types/all';
    import DashboardProfile from './DashboardProfile.svelte';
    import DashboardPosts from './DashboardPosts.svelte';
    import DashboardFriends from './DashboardFriends.svelte';
    import { onDestroy, onMount } from 'svelte';
    import type { Unsubscriber } from 'svelte/store';
    import { isInServer } from 'stores/rooms';
    import { goto } from '$app/navigation';
    import { isMobile } from 'stores/main';
    import DashboardMessages from './DashboardMessages.svelte';

    let dashboardContainer: HTMLDivElement;
    let unsubscribe: Unsubscriber;
    let unsubscribe2: Unsubscriber;

    onMount(() => {
        if (!dashboardContainer) return;

        unsubscribe = activeDashboardTab.subscribe((activeTab) => {
            if (!activeTab) return;

            setTimeout(() => {
                dashboardContainer.scrollTop = 0;
            }, 0);
        });

        unsubscribe2 = isInServer.subscribe((state) => {
            if (!state) {
                if ($activeDashboardTab == DashboardOptions.Home) {
                    goto('/home');
                } else if ($activeDashboardTab == DashboardOptions.Profile) {
                    goto('/profile');
                } else if ($activeDashboardTab == DashboardOptions.Friends) {
                    goto('/friends');
                }
            }
        });
    });

    onDestroy(() => {
        unsubscribe();
        unsubscribe2();
    });
</script>

<div
    class={`flex flex-col w-full h-[100vh] overflow-x-hidden overflow-y-auto ${
        $isMobile ? 'mobile' : ''
    }`}
    bind:this={dashboardContainer}
>
    {#if $activeDashboardTab == DashboardOptions.Home}
        <DashboardPosts />
    {:else if $activeDashboardTab == DashboardOptions.Profile}
        <DashboardProfile />
    {:else if $activeDashboardTab == DashboardOptions.Friends}
        <DashboardFriends />
    {:else if $activeDashboardTab == DashboardOptions.Messages}
        <DashboardMessages />
    {/if}
</div>
