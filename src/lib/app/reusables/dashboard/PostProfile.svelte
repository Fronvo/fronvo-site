<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import {
        DialogContent,
        DialogClose,
        DialogTrigger,
        Dialog,
        DialogDescription,
        DialogTitle,
    } from '$lib/components/ui/dialog';
    import {
        Sheet,
        SheetClose,
        SheetTitle,
        SheetTrigger,
    } from '$lib/components/ui/sheet';
    import SheetContent from '$lib/components/ui/sheet/sheet-content.svelte';
    import type { Post } from 'interfaces/all';
    import { Trash } from 'radix-icons-svelte';
    import { disconnected } from 'stores/main';
    import { onMount } from 'svelte';
    import Time from 'svelte-time/src/Time.svelte';

    export let post: Post;
    let postContainer: HTMLDivElement;

    let postData = post.post;
    let open = false;

    function deletePost() {
        // socket.emit(
        //     'deletePost',
        //     {
        //         postId: postData.postId,
        //     },
        //     async () => {
        //         open = false;
        //     },
        // );
    }

    onMount(() => {
        setTimeout(() => {
            if (postContainer) {
                postContainer.style.backgroundImage = `url(${post.post.attachment}/tr:w-600:h-600:pr-true)`;
            }
        }, 0);
    });

    $: postData = post.post;
</script>

<Sheet bind:open onOpenChange={(e) => (open = e)}>
    <SheetTrigger class="mr-1 ml-1"
        ><div
            class={`group flex w-[200px] h-[200px] items-center justify-center bg-no-repeat bg-cover bg-center mb-2 cursor-pointer`}
            bind:this={postContainer}
        >
            <div
                class="opacity-0 group-hover:opacity-100 group-hover:backdrop-brightness-[40%] flex items-center h-full w-full text-center justify-center"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    fill="white"
                    stroke="white"
                    class="w-[24px] h-[24px] mr-2 fill-text stroke-text"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="4"
                        d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8"
                    /></svg
                >

                <h1 class="text-lg font-semibold text-white">
                    {postData.totalLikes}
                </h1>
            </div>
        </div>
    </SheetTrigger>

    <SheetContent
        side="bottom"
        class="w-max min-w-none m-auto border-accent border-[1px] rounded-t-xl pr-10 pl-10"
    >
        <SheetTitle
            ><Time
                format={'MMMM DD, YYYY HH:mm'}
                timestamp={postData.creationDate}
            /></SheetTitle
        >

        <img
            src={postData.attachment}
            class="max-h-[80vh] rounded-xl object-cover m-auto mt-2"
            alt="Attachment"
        />

        <div class="flex gap-x-2 flex-1 mt-4">
            <SheetClose><Button variant="outline">Close</Button></SheetClose>

            <span class="flex-1" />

            <Dialog>
                <DialogTrigger disabled={$disconnected}>
                    <Button disabled={$disconnected} variant="destructive"
                        ><Trash class="mr-2" /> Delete</Button
                    >
                </DialogTrigger>

                <DialogContent>
                    <DialogTitle>Delete post?</DialogTitle>
                    <DialogDescription
                        >This cannot be reversed.</DialogDescription
                    >

                    <div class="flex w-full justify-end">
                        <DialogClose class="mr-2"
                            ><Button variant="outline">Cancel</Button
                            ></DialogClose
                        >

                        <DialogClose>
                            <Button on:click={deletePost} variant="destructive">
                                Delete</Button
                            >
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    </SheetContent>
</Sheet>
