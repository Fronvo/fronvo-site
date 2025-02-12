<script lang="ts">
    import PostProfile from '$lib/app/reusables/dashboard/PostProfile.svelte';
    import PropPostProfile from '$lib/app/reusables/dashboard/PropPostProfile.svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import { ourPosts } from 'stores/dashboard';
    import { disconnected, isMobile } from 'stores/main';
    import {
        deletingAccount,
        loggingOut,
        requestingData,
        switchingAccounts,
        targetProfileModal,
        updatingStatus,
        viewingProfile,
    } from 'stores/modals';
    import { ourData } from 'stores/profile';
    import { onMount } from 'svelte';
    import InfiniteLoading from 'svelte-infinite-loading';
    import { cubicInOut, sineInOut } from 'svelte/easing';
    import { fade, slide } from 'svelte/transition';
    import { loadOurPosts } from 'utilities/dashboard';
    import { isAcceptedImage, setTitle } from 'utilities/main';
    import { uploadImage } from 'utilities/rooms';
    import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuSeparator,
        DropdownMenuSub,
        DropdownMenuTrigger,
    } from '$lib/components/ui/dropdown-menu';
    import {
        ArrowRight,
        Bell,
        Calendar,
        Copy,
        EnvelopeOpen,
        HamburgerMenu,
        LockOpen1,
        Mix,
        Share2,
        Trash,
    } from 'radix-icons-svelte';
    import { toast } from 'svelte-sonner';
    import Time from 'svelte-time/src/Time.svelte';
    import { Sheet, SheetClose } from '$lib/components/ui/sheet';
    import SheetContent from '$lib/components/ui/sheet/sheet-content.svelte';
    import DropdownMenuSubTrigger from '$lib/components/ui/dropdown-menu/dropdown-menu-sub-trigger.svelte';
    import DropdownMenuSubContent from '$lib/components/ui/dropdown-menu/dropdown-menu-sub-content.svelte';
    import LargeListening from '$lib/app/reusables/profile/large/LargeListening.svelte';
    import SmallListening from '$lib/app/reusables/profile/small/SmallListening.svelte';

    async function loadMore({ detail: { loaded, complete } }): Promise<void> {
        if ($ourData.totalPosts == $ourPosts.length) {
            complete();
            return;
        }

        // socket.emit(
        //     'fetchProfilePosts',
        //     {
        //         profileId: $ourData.profileId,
        //         from: $ourPosts.length.toString(),
        //         to: ($ourPosts.length + 15).toString(),
        //     },
        //     ({ profilePosts }) => {
        //         if (profilePosts.length == 0) {
        //             complete();
        //         } else {
        //             const tempPosts = $ourPosts;
        //             tempPosts.push(...profilePosts);

        //             $ourPosts = tempPosts;

        //             loaded();
        //         }
        //     },
        // );
    }

    function viewProfile(): void {
        $targetProfileModal = $ourData;

        $viewingProfile = true;
    }

    let open = false;
    let imageSrc: string;
    let uploading = false;

    function sharePost(): void {
        let input = document.createElement('input');
        input.type = 'file';

        input.onchange = async (_) => {
            let file = Array.from(input.files)[0];

            if (file.size > 1000000) {
                return;
            }

            if (isAcceptedImage(file.type)) {
                const reader = new FileReader();

                reader.addEventListener('load', async () => {
                    open = true;

                    imageSrc = reader.result.toString();
                });

                reader.readAsDataURL(file);
            }
        };

        input.click();
    }

    async function sharePostFunc(): Promise<void> {
        uploading = true;

        // socket.emit(
        //     'sharePost',
        //     {
        //         attachment: await uploadImage(imageSrc),
        //     },
        //     () => {
        //         $ourPosts = [];

        //         loadOurPosts();

        //         open = false;

        //         uploading = false;
        //     },
        // );
    }

    function copyId(): void {
        navigator.clipboard.writeText($ourData.id);

        toast.success('Profile ID copied to clipboard!');
    }

    onMount(() => {
        setTitle(`@${$ourData.id}`);
    });
</script>

<div
    class={`fixed right-0 left-0 flex flex-col items-center h-full overflow-y-auto pb-4 pt-3`}
    style={`${!$isMobile && 'min-width: 1300px;'}`}
    in:fade={{ duration: 200, easing: sineInOut }}
>
    <img
        src={$ourData.avatar
            ? `${$ourData.avatar}/tr:w-200:h-200`
            : '/images/avatar.svg'}
        draggable={false}
        alt={`${$ourData.id}\'s avatar'`}
        class={`${
            !$ourData.avatar && 'bg-primary border-accent border-[1px] p-[5px]'
        } w-[100px] h-[100px] rounded-full select-none`}
    />

    <h1 class="text-xl ml-1 font-bold">{$ourData.username}</h1>

    <div class="flex mt-1">
        <Calendar />
        <h1 class="text-xs ml-2">
            Joined <Time
                timestamp={$ourData?.created_at}
                format="DD MMM YYYY"
            />
        </h1>
    </div>

    {#if $ourData.currentTrack}
        <div
            transition:slide={{
                easing: cubicInOut,
                duration: $ourPosts.length <= 6 ? 250 : 0,
            }}
            class="w-[292px] p-4 mt-3 pt-3 pb-3 -translate-x-1 rounded-md border-accent shadow-xl shadow-border/50 border-[1px] mb-3"
        >
            <SmallListening track={$ourData.currentTrack} />
        </div>
    {/if}

    <div class="flex items-center mt-3 ml-10 gap-x-3 select-none">
        <Button on:click={viewProfile} variant="default" size="lg"
            >View profile</Button
        >
        <Button
            on:click={sharePost}
            disabled={uploading || $disconnected}
            variant="outline"
            size="lg">Share post</Button
        >

        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="ghost" size="icon">
                    <HamburgerMenu />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent class="w-[175px]">
                <DropdownMenuItem
                    disabled={$disconnected}
                    on:click={() => ($updatingStatus = true)}
                    ><Bell class="mr-2" /> Set status</DropdownMenuItem
                >

                <DropdownMenuItem on:click={copyId}
                    ><Copy class="mr-2" /> Copy ID</DropdownMenuItem
                >

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    disabled={$disconnected}
                    on:click={() => ($switchingAccounts = true)}
                    ><LockOpen1 class="mr-2" /> Switch accounts</DropdownMenuItem
                >

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Mix class="mr-2" /> Extras
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent class="w-[175px]">
                        <DropdownMenuItem
                            disabled={$disconnected}
                            on:click={() => ($requestingData = true)}
                            ><EnvelopeOpen class="mr-2" /> Request data</DropdownMenuItem
                        >

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            disabled={$disconnected}
                            on:click={() => ($deletingAccount = true)}
                            ><Trash class="mr-2" /> Delete account</DropdownMenuItem
                        >
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuItem
                    disabled={$disconnected}
                    on:click={() => ($loggingOut = true)}
                    ><ArrowRight class="mr-2" /> Logout</DropdownMenuItem
                >
            </DropdownMenuContent>
        </DropdownMenu>
    </div>

    {#if $ourPosts.length !== 0}
        <div
            class="flex w-full max-w-[700px] flex-wrap items-center mt-4 ml-12"
        >
            {#each $ourPosts as post}
                <PostProfile {post} />
            {/each}

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
        </div>
    {:else}
        <div
            class="flex w-full max-w-[700px] flex-wrap items-center mt-4 ml-20"
        >
            {#each { length: 3 } as _}
                <PropPostProfile />
            {/each}
        </div>
    {/if}
</div>

<Sheet bind:open onOpenChange={(e) => (open = e)}>
    <SheetContent
        side="bottom"
        class="w-max min-w-none m-auto border-accent border-[1px] rounded-t-xl pr-10 pl-10"
    >
        <img
            src={imageSrc}
            alt="Icon"
            class="max-h-[80vh] rounded-xl object-cover m-auto mt-2"
        />

        <div class="flex gap-x-2 flex-1 mt-4">
            <SheetClose disabled={uploading}
                ><Button variant="outline" disabled={uploading}>Close</Button
                ></SheetClose
            >

            <span class="flex-1" />

            <Button disabled={uploading} on:click={sharePostFunc}
                >Share image <Share2 class="ml-2" /></Button
            >
        </div>
    </SheetContent>
</Sheet>
