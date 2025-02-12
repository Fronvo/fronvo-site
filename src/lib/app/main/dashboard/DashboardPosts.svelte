<script lang="ts">
    import { isMobile } from 'stores/main';
    import {
        dashboardPosts as dashboardPostsStore,
        ourPosts,
        totalDashboardPosts,
    } from 'stores/dashboard';
    import InfiniteLoading from 'svelte-infinite-loading';
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { ourData } from 'stores/profile';
    import { sineInOut } from 'svelte/easing';
    import PostDashboard from '$lib/app/reusables/dashboard/PostDashboard.svelte';
    import { setTitle } from 'utilities/main';
    import PropPost from '$lib/app/reusables/dashboard/PropPost.svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import Separator from '$lib/components/ui/separator/separator.svelte';

    let activeTab = 0;

    function reloadPosts(): void {
        // socket.emit(
        //     'fetchDashboard',
        //     {
        //         from: '0',
        //         to: '20',
        //     },
        //     ({ dashboard, totalPosts }) => {
        //         $dashboardPostsStore = [];
        //         setTimeout(() => {
        //             $dashboardPostsStore = dashboard;
        //             $totalDashboardPosts = totalPosts;
        //         }, 0);
        //     },
        // );
    }

    async function loadMore({ detail: { loaded, complete } }): Promise<void> {
        // socket.emit(
        //     'fetchDashboard',
        //     {
        //         from: $dashboardPostsStore.length.toString(),
        //         to: ($dashboardPostsStore.length + 15).toString(),
        //     },
        //     ({ dashboard }) => {
        //         if (dashboard.length == 0) {
        //             complete();
        //         } else {
        //             const tempPosts = $dashboardPostsStore;
        //             tempPosts.push(...dashboard);
        //             $dashboardPostsStore = tempPosts;
        //             loaded();
        //         }
        //     },
        // );
    }

    onMount(() => {
        setTitle('');

        // socket.on('postRemoved', async ({ postId }) => {
        //     const ourPostIds = $ourPosts.map((v) => v.post.postId);

        //     if (!ourPostIds.includes(postId)) {
        //         reloadPosts();
        //     }
        // });

        // socket.on('postShared', ({ author }) => {
        //     if (author == $ourData.profileId) return;

        //     reloadPosts();
        // });
    });
</script>

<div
    class={`fixed right-0 left-0 overflow-x-hidden h-[100vh] ${
        $dashboardPostsStore.length === 0
            ? 'overflow-hidden'
            : 'overflow-y-auto'
    } ${$isMobile ? 'mobile' : ''}`}
    in:fade={{ duration: 200, easing: sineInOut }}
>
    <div
        class="top-container z-10000 right-0 left-0 w-[600px] m-auto select-none fixed flex items-center justify-center z-10 pt-3 pb-3 bg-background/75 backdrop-blur"
    >
        {#each ['Following', 'Official'] as tab, i}
            <Button
                variant="outline"
                class={`${
                    activeTab === i &&
                    'bg-primary border-primary text-accent hover:bg-primary hover:text-accent'
                } rounded-full w-[150px] mr-1 ml-1`}
                on:click={() => (activeTab = i)}>{tab}</Button
            >
        {/each}
    </div>

    {#if $dashboardPostsStore.length !== 0}
        <div
            class="posts-container flex flex-col items-center overflow-x-hidden mt-20"
            style={`${!$isMobile && 'min-width: 1200px;'}`}
        >
            {#if $dashboardPostsStore}
                {#each $dashboardPostsStore as post}
                    <PostDashboard {post} />

                    <Separator class="w-[500px] opacity-50" />
                {/each}

                <h1 class="translate-y-16 text-lg">That's all for now!</h1>

                <img
                    src="/images/grass.svg"
                    draggable={false}
                    alt="Grass"
                    class="w-[750px] h-[250px]"
                />

                <InfiniteLoading
                    distance={1000}
                    on:infinite={loadMore}
                    direction="bottom"
                >
                    <div slot="noMore" />
                    <div slot="noResults" />
                    <div slot="error" />
                    <div slot="spinner" />
                </InfiniteLoading>
            {/if}
        </div>
    {:else}
        <div
            class="props-container flex flex-col m-auto items-center mt-20 overflow-hidden"
            style={`${!$isMobile && 'min-width: 1200px;'}`}
        >
            {#each { length: 2 } as _}
                <PropPost />
            {/each}
        </div>
    {/if}
</div>

<style>
    @media screen and (max-width: 1200px) {
        .top-container {
            position: initial;
            margin-bottom: 20px;
            min-width: 1200px;
        }

        .mobile .top-container {
            width: max-content;
            min-width: 0px;
        }

        .posts-container {
            margin-top: 0px;
        }

        .props-container {
            margin-top: 0;
        }
    }
</style>
