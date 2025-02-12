<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { DialogClose, DialogTitle } from '$lib/components/ui/dialog';
    import { Sheet, SheetTrigger } from '$lib/components/ui/sheet';
    import SheetContent from '$lib/components/ui/sheet/sheet-content.svelte';
    import {
        differenceInDays,
        differenceInHours,
        differenceInMinutes,
        differenceInMonths,
        differenceInYears,
    } from 'date-fns';
    import type { Post } from 'interfaces/all';
    import { cachedAccountData } from 'stores/main';
    import { targetProfileModal, viewingProfile } from 'stores/modals';
    import { onDestroy, onMount } from 'svelte';
    import Time from 'svelte-time/src/Time.svelte';
    import { findCachedAccount } from 'utilities/main';

    export let post: Post;

    let postData = post.post;
    let profileData = post.profileData;

    let dateSuffix: string;

    let preloaded = false;

    function updateSuffix(date: string): void {
        const date2 = new Date(date);

        const years = differenceInYears(new Date(), date2);

        const months = differenceInMonths(new Date(), date2);

        const days = differenceInDays(new Date(), date2);

        const hours = differenceInHours(new Date(), date2);

        const minutes = differenceInMinutes(new Date(), date2);

        if (years > 0) {
            dateSuffix = `${years} y`;
        } else if (months > 0) {
            dateSuffix = `${months} mo`;
        } else if (days > 0) {
            dateSuffix = `${days} d`;
        } else if (hours > 0) {
            dateSuffix = `${hours} h`;
        } else if (minutes > 0) {
            dateSuffix = `${minutes} m`;
        } else {
            dateSuffix = 'now';
        }
    }

    async function showProfile(): Promise<void> {
        $targetProfileModal = await findCachedAccount(
            postData.profile_id,
            $cachedAccountData
        );

        $viewingProfile = true;
    }

    function likePost(): void {
        // Simulate
        if (postData.isLiked) {
            postData.isLiked = false;

            postData.totalLikes -= 1;
        } else {
            postData.isLiked = true;

            postData.totalLikes += 1;
        }

        // socket.emit('likePost', {
        //     postId: postData.postId,
        // });
    }

    onMount(() => {
        let img = new Image();
        img.src = `${post.post.attachment}/tr:w-1000:h-1000:pr-true`;

        img.onload = () => (preloaded = true);

        // socket.on('postLikesChanged', ({ postId, likes }) => {
        //     if (postData.postId == postId) {
        //         postData.totalLikes = likes;
        //     }
        // });
    });

    onDestroy(() => (preloaded = false));

    $: updateSuffix(postData.posted_at);
</script>

<div class={`pb-[50px] ${!preloaded ? 'hidden' : ''}`}>
    <div class="flex items-center justify-start w-full mb-3">
        <img
            on:click={showProfile}
            on:keydown={showProfile}
            src={profileData.avatar
                ? `${profileData.avatar}/tr:w-72:h-72`
                : '/images/avatar.svg'}
            draggable={false}
            alt={`${postData.author}\'s avatar'`}
            class="w-[32px] h-[32px] rounded-full mr-2"
        />

        <h1 class="text-sm mr-1 tracking-tight font-bold mb-0.5">
            {postData.profile_id}
        </h1>

        <h1 class="text-xs font-light">• {dateSuffix}</h1>
    </div>

    <!-- Ambiency in the future? -->
    <Sheet>
        <SheetTrigger class="flex w-max mr-auto">
            <img
                class="border-primary/1 border-[1px] rounded-md w-[500px] h-[500px] object-contain"
                src={`${post.post.attachment}/tr:pr-true`}
                draggable={false}
                alt={`${post.profileData.id}\'s post'`}
            />
        </SheetTrigger>

        <SheetContent
            side="bottom"
            class="w-max min-w-[35vw] m-auto border-accent border-[1px] rounded-t-xl pr-10 pl-10"
        >
            <DialogTitle>
                {postData.profile_id} •
                <Time
                    format={'MMMM DD, YYYY'}
                    timestamp={postData.posted_at}
                /></DialogTitle
            >

            <img
                src={postData.attachment}
                class="max-h-[80vh] rounded-xl object-cover m-auto mt-2"
                alt="Attachment"
            />

            <div class="flex gap-x-2 flex-1 mt-4">
                <DialogClose
                    ><Button variant="outline">Close</Button></DialogClose
                >
            </div>
        </SheetContent>
    </Sheet>

    <div class="flex w-full items-center justify-start mt-2">
        {#if postData.isLiked}
            <svg
                on:click={likePost}
                on:keydown={likePost}
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 48 48"
                class="cursor-pointer w-[28px] h-[28px] mr-2"
                ><path
                    fill="red"
                    stroke="red"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                    d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8"
                /></svg
            >
        {:else}
            <svg
                on:click={likePost}
                on:keydown={likePost}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                class="cursor-pointer w-[28px] h-[28px] mr-2"
                ><path
                    fill="none"
                    stroke="red"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                    d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8"
                /></svg
            >
        {/if}

        <h1 class="font-semibold text-sm">
            {postData.totalLikes} like{postData.totalLikes != 1 ? 's' : ''}
        </h1>

        <!-- <svg
            on:click={sharePost}
            on:keydown={sharePost}
            id="send"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="none"
            ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="m14 10l-3 3m9.288-9.969a.535.535 0 0 1 .68.681l-5.924 16.93a.535.535 0 0 1-.994.04l-3.219-7.242a.535.535 0 0 0-.271-.271l-7.242-3.22a.535.535 0 0 1 .04-.993z"
            /></svg
        > -->
    </div>
</div>
