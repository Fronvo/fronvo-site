<script lang="ts">
    import { ourData } from 'stores/profile';
    import {
        canMessage,
        currentChannel,
        currentRoomData,
        currentRoomId,
        currentRoomLoaded,
        currentRoomMessages,
        currentServer,
        isInServer,
        pendingMessages,
        replyingTo,
        replyingToId,
        sendContent,
        sendingImage,
    } from 'stores/rooms';
    import { onDestroy, onMount } from 'svelte';
    import { sendImage, sendMessage } from 'utilities/rooms';
    import { disconnected } from 'stores/main';
    import { isAcceptedImage } from 'utilities/main';
    import { toast } from 'svelte-sonner';
    import type { Unsubscriber } from 'svelte/motion';
    import { Cross1, PaperPlane } from 'radix-icons-svelte';
    import Textarea from '$lib/components/ui/textarea/textarea.svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import { Sheet, SheetClose } from '$lib/components/ui/sheet';
    import SheetContent from '$lib/components/ui/sheet/sheet-content.svelte';
    import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuTrigger,
    } from '$lib/components/ui/dropdown-menu';
    import Input from '$lib/components/ui/input/input.svelte';
    import type { TenorGifs } from 'interfaces/all';
    import PropFavorite from '$lib/app/reusables/rooms/PropFavorite.svelte';
    import { fade } from 'svelte/transition';
    import { flyAndScaleImmediate } from '$lib/utils';

    let content: Textarea;
    let unsubscribe: Unsubscriber;
    let unsubscribe2: Unsubscriber;
    let unsubscribe3: Unsubscriber;

    let cantMessageReason: string;

    let open = false;
    let imageSrc: string;
    let sending = false;

    let gifsOpen = false;
    let gifSearch = '';
    let gifsP: TenorGifs[] = [];
    let showEmptyGifs = true;

    function adjustCanMessage(): void {
        if (!$isInServer) {
            if (!$currentRoomData.dmUser.username) {
                $canMessage = false;
                cantMessageReason = 'This user has been deleted';
            } else if (!$ourData.friends.includes($currentRoomData.dmUser.id)) {
                $canMessage = false;
                cantMessageReason = 'This user is not your friend.';
            } else {
                $canMessage = true;
                cantMessageReason = '';
            }
        } else {
            $canMessage = true;
            cantMessageReason = '';
        }

        if ($canMessage) {
            if ($sendingImage) {
                $canMessage = false;
                cantMessageReason = 'Sending image...';
            } else {
                $canMessage = true;
            }
        }

        setTimeout(() => {
            if (!content) return;

            if (!$canMessage) {
                content.placeholder = cantMessageReason;

                if (!$sendingImage) {
                    setTimeout(() => {
                        content.disabled = true;
                    }, 0);
                }
            } else {
                content.placeholder = `Message ${
                    !$isInServer
                        ? '@' + $currentRoomData.dmUser.username
                        : '#' + $currentChannel.name
                }`;

                content.disabled = false;
            }
        }, 0);
    }

    function cancelReply(): void {
        $replyingTo = undefined;
        $replyingToId = undefined;
    }

    function sendMsg(): void {
        sendMessage(
            $currentChannel?.id || $currentRoomId,
            $sendContent,
            $replyingTo,
            $replyingToId,
            $currentRoomMessages,
            $pendingMessages,
            $ourData,
            $isInServer ? $currentServer.id : ''
        );
    }

    function sendGIF(gif: string): void {
        // if (!$isInServer) {
        //     socket.emit('sendMessage', {
        //         roomId: $currentRoomId,
        //         message: gif,
        //     });
        // } else {
        //     socket.emit('sendChannelMessage', {
        //         serverId: $currentServer?.serverId,
        //         channelId: $currentChannel?.channelId,
        //         message: gif,
        //     });
        // }

        gifsOpen = false;
    }

    function setupImagePasting(): void {
        setTimeout(() => {
            if (!content) return;

            content.$on('paste', (ev) => {
                if (ev.clipboardData.files.length > 0) {
                    const file = ev.clipboardData.files[0];

                    if (file.size > 10000000) {
                        toast(`Image is above 10MB.`);
                        return;
                    }

                    if (isAcceptedImage(file.type)) {
                        const reader = new FileReader();

                        reader.addEventListener('load', async () => {
                            imageSrc = reader.result.toString();

                            open = true;
                        });

                        reader.readAsDataURL(file);
                    } else {
                        toast('Unsupported file type.');
                    }
                }
            });
        }, 0);
    }

    function openInputForImage(): void {
        if (!$canMessage) return;

        let input = document.createElement('input');
        input.type = 'file';

        input.onchange = async (_) => {
            let file = Array.from(input.files)[0];

            if (file.size > 10000000) {
                toast(`Image is above 10MB.`);
                return;
            }

            if (isAcceptedImage(file.type)) {
                const reader = new FileReader();

                reader.addEventListener('load', async () => {
                    imageSrc = reader.result.toString();

                    open = true;
                });

                reader.readAsDataURL(file);
            } else {
                toast('Unsupported file type.');
            }
        };

        input.click();
    }

    async function sendImageFunc(): Promise<void> {
        sending = true;

        await sendImage(
            $currentChannel?.id || $currentRoomId,
            $sendingImage,
            imageSrc,
            $isInServer ? $currentServer.id : ''
        );

        open = false;

        sending = false;
    }

    async function keydownListener(e: KeyboardEvent): Promise<void> {
        if (e.shiftKey || e.key == 'Escape' || e.key == 'Enter') {
            return;
        }

        let oldVal: string;

        setTimeout(() => {
            // @ts-ignore
            oldVal = e.target.value;

            if (oldVal.length == 0) {
                showEmptyGifs = true;
                return;
            }

            showEmptyGifs = false;
        }, 0);

        setTimeout(() => {
            // @ts-ignore
            if (oldVal != e.target.value || oldVal == '') {
                gifsP = [];
                return;
            }

            gifsP = [];

            // socket.emit('fetchTenor', { q: oldVal }, ({ gifs }) => {
            //     if (gifs.length > 0) {
            //         gifsP = gifs;
            //     }
            // });
        }, 250);
    }

    onMount(() => {
        // socket.on('friendAdded', ({}) => adjustCanMessage());
        // socket.on('friendRemoved', ({}) => adjustCanMessage());

        unsubscribe = replyingTo.subscribe((val) => {
            if (!$currentRoomId) return;

            setTimeout(() => {
                if (!content) return;

                if (!val) {
                    content.placeholder = `Message ${
                        !$isInServer
                            ? '@' + $currentRoomData.dmUser.username
                            : '#' + $currentChannel.name
                    }`;
                } else {
                    if (val == $ourData.username) {
                        val = 'yourself';
                    }

                    content.placeholder = `Replying to ${val}`;
                }
            }, 0);
        });

        unsubscribe2 = currentRoomLoaded.subscribe((state) => {
            if (!state) return;

            adjustCanMessage();
            setupImagePasting();

            document.addEventListener('keydown', (ev) => {
                // Default to room chat input if no other input is focused
                if (
                    document.activeElement.tagName
                        .toLowerCase()
                        .includes('input') ||
                    (document.activeElement.tagName
                        .toLowerCase()
                        .includes('textarea') &&
                        document.activeElement.id != 'textarea-content')
                )
                    return;

                if (ev.key == 'Enter' && !ev.shiftKey) {
                    ev.preventDefault();
                } else {
                    if (
                        ev.ctrlKey ||
                        ev.key == 'ArrowUp' ||
                        ev.key == 'ArrowDown' ||
                        ev.key == 'PageUp' ||
                        ev.key == 'PageDown'
                    )
                        return;

                    content &&
                        document.getElementById('textarea-content').focus();
                }
            });

            $replyingTo = undefined;
            $replyingToId = undefined;

            setTimeout(() => {
                if (!content) return;

                content.$on('keyup', (ev) => {
                    if (ev.key == 'Enter' && !ev.shiftKey) {
                        sendMsg();

                        ev.preventDefault();

                        adjustCanMessage();
                    }
                });
            }, 0);
        });

        unsubscribe3 = sendingImage.subscribe(() => {
            if (!content) return;

            adjustCanMessage();
        });
    });

    onDestroy(() => {
        unsubscribe();
        unsubscribe2();
        unsubscribe3();
    });
</script>

{#if $currentRoomLoaded}
    <div class="flex flex-col w-full flex-1 z-[11]">
        {#if $replyingTo}
            <div
                class="flex items-center mr-3 ml-3 border bg-secondary/40 rounded-t-[12px] pr-3 pl-3 pt-1 pb-1"
            >
                <h1 class="text-[0.8rem]">
                    Replying to{' '}
                    <b>
                        {$replyingTo}
                    </b>
                </h1>

                <span class="flex-1" />

                <Button
                    class="flex items-center mr-1 rounded-full p-1 w-[24px] h-[24px] cursor-pointer"
                    variant="outline"
                    size="icon"
                    on:click={cancelReply}
                >
                    <Cross1 />
                </Button>
            </div>
        {/if}

        <div
            class={`flex mr-3 ml-3 mb-3 pt-0.5 pb-0.5 border items-center bg-secondary/40 ${
                $replyingTo ? 'rounded-b-[12px]' : 'rounded-xl'
            } pr-3 pl-3`}
        >
            <Button
                variant="ghost"
                class="min-w-[32px] w-[32px] h-[32px] m-0 p-0 rounded-full duration-0"
                on:click={openInputForImage}
                disabled={!$canMessage || $disconnected}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    class="min-w-[24px] w-[24px] h-[24px]"
                    ><path
                        fill="currentColor"
                        d="M17 13h-4v4h-2v-4H7v-2h4V7h2v4h4m-5-9A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"
                    /></svg
                >
            </Button>

            <Textarea
                bind:this={content}
                id="textarea-content"
                autofocus
                class="border-none bg-transparent min-h-[20px] h-[20px] max-h-[200px]"
                placeholder={cantMessageReason ||
                    `Message ${
                        !$isInServer
                            ? '@' + $currentRoomData?.dmUser.username
                            : '#' + $currentChannel?.name
                    }`}
                bind:value={$sendContent}
                disabled={!$canMessage || $disconnected}
            />

            <DropdownMenu
                bind:open={gifsOpen}
                onOpenChange={(e) => {
                    gifsOpen = e;
                    gifsP = [];
                    gifSearch = '';
                    showEmptyGifs = true;
                }}
            >
                <DropdownMenuTrigger disabled={!$canMessage || $disconnected}>
                    <Button
                        variant="ghost"
                        class="w-[32px] h-[32px] m-0 p-0 duration-0"
                        disabled={!$canMessage || $disconnected}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 16 16"
                            class="w-[24px] h-[24px]"
                            ><path
                                fill="currentColor"
                                d="M1 4.5A2.5 2.5 0 0 1 3.5 2h9A2.5 2.5 0 0 1 15 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 11.5zm4.052 2.206c.481-.05.853.036.986.103a.5.5 0 1 0 .447-.894c-.351-.176-.928-.267-1.537-.203c-.96.1-1.948.934-1.948 2.297c0 1.385 1.054 2.3 2.3 2.3c.58 0 1.1-.273 1.397-.553c.262-.248.303-.578.303-.783v-.964a.5.5 0 0 0-.5-.5h-.807a.5.5 0 0 0 0 1H6v.463a.4.4 0 0 1-.006.072a1.13 1.13 0 0 1-.694.264c-.731 0-1.3-.504-1.3-1.3c0-.817.567-1.251 1.052-1.302M9 6.21a.5.5 0 0 0-1 0v3.6a.5.5 0 0 0 1 0zm1.5-.5a.5.5 0 0 0-.5.5v3.6a.5.5 0 0 0 1 0V8.505l1.003-.006a.5.5 0 0 0-.006-1L11 7.506v-.797h1.5a.5.5 0 0 0 0-1z"
                            /></svg
                        >
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    transition={flyAndScaleImmediate}
                    side="top"
                    class="w-[500px] h-[460px] -translate-y-2 z-[10] -translate-x-[222px] p-0 rounded-lg"
                >
                    <Input
                        bind:value={gifSearch}
                        placeholder="Search Tenor"
                        class="text-sm font-medium border-1 p-4 bg-background rounded-t-lg rounded-b-none mr-0 ml-0"
                        on:keydown={(e) => keydownListener(e)}
                    />

                    {#if showEmptyGifs}
                        <div
                            class="flex flex-col select-none mt-4 w-full h-full"
                        >
                            <div class="flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 16 16"
                                    class="w-[24px] h-[24px] mr-2"
                                    ><path
                                        fill="currentColor"
                                        d="M1 4.5A2.5 2.5 0 0 1 3.5 2h9A2.5 2.5 0 0 1 15 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 11.5zm4.052 2.206c.481-.05.853.036.986.103a.5.5 0 1 0 .447-.894c-.351-.176-.928-.267-1.537-.203c-.96.1-1.948.934-1.948 2.297c0 1.385 1.054 2.3 2.3 2.3c.58 0 1.1-.273 1.397-.553c.262-.248.303-.578.303-.783v-.964a.5.5 0 0 0-.5-.5h-.807a.5.5 0 0 0 0 1H6v.463a.4.4 0 0 1-.006.072a1.13 1.13 0 0 1-.694.264c-.731 0-1.3-.504-1.3-1.3c0-.817.567-1.251 1.052-1.302M9 6.21a.5.5 0 0 0-1 0v3.6a.5.5 0 0 0 1 0zm1.5-.5a.5.5 0 0 0-.5.5v3.6a.5.5 0 0 0 1 0V8.505l1.003-.006a.5.5 0 0 0-.006-1L11 7.506v-.797h1.5a.5.5 0 0 0 0-1z"
                                    /></svg
                                >

                                <h1>Start typing to share GIFs!</h1>
                            </div>

                            <div
                                class="flex items-center justify-center flex-wrap mt-3"
                            >
                                {#each { length: 6 } as _}
                                    <PropFavorite />
                                {/each}
                            </div>

                            <h1 class="text-xs text-center mt-8 h-full">
                                Powered by Tenor
                            </h1>
                        </div>
                    {:else}
                        <div
                            class="[&::-webkit-scrollbar]:bg-none [&::-webkit-scrollbar]:w-[10px] [&::-webkit-scrollbar-thumb]:bg-accent flex flex-wrap w-full max-h-[420px] items-center justify-center overflow-y-auto"
                        >
                            {#each gifsP as { gif_medium }, i}
                                <img
                                    on:click={() => sendGIF(gif_medium)}
                                    on:keydown={() => sendGIF(gif_medium)}
                                    in:fade={{
                                        duration: 500,
                                        delay:
                                            i < 6
                                                ? Math.min(2000, i + i * 75)
                                                : 0,
                                    }}
                                    src={gif_medium}
                                    alt="Tenor GIF"
                                    draggable={false}
                                    class="w-[50%] max-h-[200px] h-max rounded-md mb-2 hover:opacity-75 border-[3px] cursor-pointer border-transparent"
                                />
                            {/each}
                        </div>
                    {/if}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
{/if}

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
            <SheetClose disabled={sending}
                ><Button variant="outline" disabled={sending}>Close</Button
                ></SheetClose
            >

            <span class="flex-1" />

            <Button disabled={sending} on:click={sendImageFunc}
                >Send image <PaperPlane class="ml-2" /></Button
            >
        </div>
    </SheetContent>
</Sheet>
