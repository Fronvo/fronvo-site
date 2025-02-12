<script lang="ts">
    import type { RoomMessage, FronvoAccount } from 'interfaces/all';
    import { ourData } from 'stores/profile';
    import {
        replyingToId,
        replyingTo,
        currentRoomMessages as roomMessages,
        currentServer,
        canMessage,
    } from 'stores/rooms';
    import Time from 'svelte-time/src/Time.svelte';
    import { differenceInMinutes } from 'date-fns';
    import { findCachedAccount } from 'utilities/main';
    import { targetProfileModal, viewingProfile } from 'stores/modals';
    import linkifyHtml from 'linkify-html';
    import { cachedAccountData, disconnected } from 'stores/main';
    import { ExternalLink, Image, Reset, Trash } from 'radix-icons-svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import {
        Dialog,
        DialogClose,
        DialogTrigger,
    } from '$lib/components/ui/dialog';
    import DialogContent from '$lib/components/ui/dialog/dialog-content.svelte';
    import DialogTitle from '$lib/components/ui/dialog/dialog-title.svelte';
    import DialogDescription from '$lib/components/ui/dialog/dialog-description.svelte';
    import { Sheet, SheetTrigger } from '$lib/components/ui/sheet';
    import SheetContent from '$lib/components/ui/sheet/sheet-content.svelte';

    export let i = -1;
    export let profileData: FronvoAccount;
    export let messageData: RoomMessage;
    export let hideCondition = false;
    export let isPending = false;

    // Skip context if same account
    let skipContext: boolean;
    // Skip time if messages are sent less than 15 minutes ago
    let showTime: boolean;
    let showLinks = false;

    $: {
        // Skip time if messages are sent less than 15 minutes ago
        showTime =
            differenceInMinutes(
                new Date(messageData.created_at),
                new Date($roomMessages[i - 1]?.message.created_at)
            ) > 15 ||
            new Date(messageData.created_at).getDay() !==
                new Date($roomMessages[i - 1]?.message.created_at).getDay() ||
            typeof $roomMessages[i - 1] == 'undefined';

        // Skip context if same account, less than 15 minutes ago
        skipContext =
            $roomMessages[i - 1]?.profileData.id == profileData?.id &&
            !showTime &&
            differenceInMinutes(
                new Date(messageData.created_at),
                new Date($roomMessages[i - 1]?.message.created_at)
            ) < 15 &&
            !messageData.reply_id;

        // Sanitise first
        showLinks =
            messageData.content?.includes('https') &&
            !messageData.content?.includes('<img') &&
            !messageData.content?.includes('<svg');
    }

    async function showProfileModal(): Promise<void> {
        if (profileData.id == $ourData.id) {
            $targetProfileModal = $ourData;
        } else {
            $targetProfileModal = await findCachedAccount(
                profileData.id,
                $cachedAccountData
            );
        }

        $viewingProfile = true;
    }

    async function showReplyProfileModal(): Promise<void> {
        const targetAccount = getRepliedMessage().profileData;

        if (targetAccount.id == $ourData.id) {
            $targetProfileModal = $ourData;
        } else {
            $targetProfileModal = await findCachedAccount(
                targetAccount.id,
                $cachedAccountData
            );
        }

        $viewingProfile = true;
    }

    function getRepliedMessage(): {
        message: RoomMessage;
        profileData: FronvoAccount;
    } {
        for (const messageIndex in $roomMessages) {
            const message = $roomMessages[messageIndex];

            if (message.message?.id == messageData.reply_id) {
                return message;
            }
        }
    }

    function updateReplying(): void {
        $replyingTo = messageData.profile_id;
        $replyingToId = messageData.id;
    }

    function deleteMessage(): void {
        // if (!$isInServer) {
        //     socket.emit('deleteMessage', {
        //         roomId: $currentRoomId,
        //         messageId: messageData.messageId,
        //     });
        // } else {
        //     socket.emit('deleteChannelMessage', {
        //         serverId: $currentServer.serverId,
        //         channelId: $currentChannel.channelId,
        //         messageId: messageData.messageId,
        //     });
        // }
    }
</script>

{#if showTime}
    <div class="flex">
        <h1
            class="font-medium text-[0.65rem] m-auto w-max rounded-full border-accent bg-secondary/40 mt-2 border-[1px] p-1 pr-2 pl-2 select-none"
        >
            <Time
                timestamp={messageData.created_at}
                format="MMMM D, YYYY HH:mm"
            />
        </h1>
    </div>
{/if}

<div
    class={`message-containe flex flex-col items-start justify-start w-full max-w-full mt-0 cursor-default pl-[15px] pb-[5px] z-[1] group`}
    class:hidden={hideCondition}
    class:mt-4={!skipContext}
>
    {#if messageData.reply_id}
        <div class="flex items-center pb-1 select-none">
            <span class="w-[25px] translate-x-4 border-accent border-[1px]" />
            <span
                class="w-[2px] h-[20px] translate-y-[9px] translate-x-[-10px] border-accent border-[1px]"
            />

            <div class="flex items-center ml-6">
                <img
                    src={getRepliedMessage()?.profileData.avatar
                        ? `${
                              getRepliedMessage()?.profileData.avatar
                          }/tr:w-48:h-48`
                        : '/images/avatar.svg'}
                    draggable={false}
                    alt={`${getRepliedMessage()?.profileData.id}\'s avatar'`}
                    class={`${
                        !getRepliedMessage()?.profileData.avatar &&
                        'bg-primary p-[2px]'
                    } w-[20px] h-[20px] rounded-full mr-2`}
                />
                <h1
                    on:click={showReplyProfileModal}
                    on:keydown={showReplyProfileModal}
                    id="username"
                    class="text-xs hover:underline cursor-pointer mr-2 font-medium"
                >
                    {getRepliedMessage()?.profileData.username}
                </h1>
                <h1
                    id="reply"
                    class="text-xs text-[0.85rem] pt-1 pb-1 pr-3 opacity-75 pl-3 h-max bg-secondary/20 rounded-[20px] border max-w-[400px] overflow-hidden text-ellipsis whitespace-nowrap"
                >
                    {#if getRepliedMessage()?.message.content}
                        {getRepliedMessage().message.content}
                    {:else if getRepliedMessage()?.message.attachments}
                        <Sheet>
                            <SheetTrigger class="flex hover:underline"
                                ><Image class="mr-2" /> Attachment</SheetTrigger
                            >

                            <SheetContent
                                class="w-max min-w-none m-auto border-accent border-[1px] rounded-t-xl pr-10 pl-10"
                                side="bottom"
                            >
                                <img
                                    src={`${
                                        getRepliedMessage()?.message.attachments
                                    }/tr:pr-true`}
                                    alt={'Message attachment'}
                                    class="max-h-[80vh] rounded-xl object-cover m-auto mt-2"
                                />
                            </SheetContent>
                        </Sheet>
                    {:else if getRepliedMessage()?.message.tenor_url}
                        <Sheet>
                            <SheetTrigger class="flex hover:underline"
                                ><Image class="mr-2" /> GIF</SheetTrigger
                            >

                            <SheetContent
                                class="w-max min-w-none m-auto border-accent border-[1px] rounded-t-xl pr-10 pl-10"
                                side="bottom"
                            >
                                <img
                                    src={`${
                                        getRepliedMessage()?.message.tenor_url
                                    }/tr:pr-true`}
                                    alt={'Message attachment'}
                                    class="max-h-[80vh] rounded-xl object-cover m-auto mt-2"
                                />
                            </SheetContent>
                        </Sheet>
                    {:else if getRepliedMessage()?.message.spotify_embed}
                        <a
                            class="flex hover:underline cursor-pointer"
                            target="_blank"
                            href={getRepliedMessage()?.message.spotify_embed.replace(
                                '/embed/',
                                '/'
                            )}
                        >
                            <ExternalLink class="mr-2" /> Spotify song
                        </a>
                    {:else}
                        <span class="italic">Message not found</span>
                    {/if}
                </h1>
            </div>
        </div>
    {/if}

    <div class="flex">
        {#if !skipContext}
            <img
                on:click={showProfileModal}
                on:keydown={showProfileModal}
                src={profileData.avatar
                    ? `${profileData.avatar}/tr:w-64:h-64`
                    : '/images/avatar.svg'}
                draggable={false}
                alt={`${profileData.id}\'s avatar'`}
                class={`${
                    !profileData.avatar &&
                    'bg-primary border-accent border-[1px] p-[3px]'
                } min-w-[32px] w-[32px] h-[32px] rounded-full mt-6 cursor-pointer select-none`}
            />
        {:else}
            <h1
                class="text-xs m-auto min-w-[32px] w-[32px] group-hover:opacity-100 opacity-0"
            >
                <Time timestamp={messageData.created_at} format="HH:mm" />
            </h1>
        {/if}

        <div class="flex flex-col items-start ml-1">
            <div class="flex items-center justify-center pb-[3px]">
                {#if !skipContext}
                    <h1
                        class="text-[0.8rem] font-medium max-w-[150px] ml-3 text-ellipsis overflow-hidden"
                    >
                        {profileData.username}
                    </h1>
                {/if}
            </div>

            <div class="flex items-start justify-start">
                {#if messageData.tenor_url}
                    <div>
                        <Sheet>
                            <SheetTrigger>
                                <img
                                    src={messageData.tenor_url}
                                    draggable={false}
                                    alt={'Tenor GIF'}
                                    class={`ml-3 max-h-[250px] rounded-lg`}
                                />
                            </SheetTrigger>

                            <SheetContent
                                side="bottom"
                                class="w-max min-w-none m-auto border-accent border-[1px] rounded-t-xl pr-10 pl-10"
                            >
                                <img
                                    src={messageData.tenor_url}
                                    draggable={false}
                                    alt={'Tenor GIF'}
                                    class="max-h-[80vh] rounded-xl object-cover m-auto mt-2"
                                />
                            </SheetContent>
                        </Sheet>

                        <h1 class="text-xs ml-4 text-primary uppercase">GIF</h1>
                    </div>
                {:else if messageData.spotify_embed}
                    <div
                        id="spotify"
                        class={`${skipContext ? 'ml-[5px]' : 'ml-2'} h-[80px]`}
                    >
                        {@html `<iframe style="border-radius: 20px" src="${
                            messageData.spotify_embed
                        }" width="${
                            document.body.clientWidth < 1000 ? 300 : 400
                        }" height="80" loading="lazy"></iframe>`}
                    </div>
                {:else if messageData.attachments.length > 0}
                    <!-- TODO: Design for multiple -->
                    <Sheet>
                        <SheetTrigger>
                            <img
                                src={`${messageData.attachments}/tr:q-70`}
                                draggable={false}
                                alt={'Message attachment'}
                                class={`ml-[8px] rounded-lg max-h-[500px] max-w-[500px]`}
                            />
                        </SheetTrigger>

                        <SheetContent
                            class="w-max min-w-none m-auto border-accent border-[1px] rounded-t-xl pr-10 pl-10"
                            side="bottom"
                        >
                            <img
                                src={`${messageData.attachments}/tr:pr-true`}
                                alt={'Message attachment'}
                                class="max-h-[80vh] rounded-xl object-cover m-auto mt-2"
                            />
                        </SheetContent>
                    </Sheet>
                {:else}
                    <h1
                        class={`text-[0.85rem] cursor-text pt-2 pb-2 pr-3 pl-3 w-[100%] h-max whitespace-pre-wrap bg-secondary/20 ml-1.5 rounded-[20px] border ${
                            $replyingToId &&
                            $replyingToId === messageData.id &&
                            'border-primary/25'
                        }`}
                    >
                        {#if showLinks}
                            {@html linkifyHtml(messageData.content, {
                                attributes: {
                                    class: 'text-link font-medium hover:underline no-underline',
                                    target: '_blank',
                                },
                            })}
                        {:else}
                            {messageData.content}
                        {/if}
                    </h1>
                {/if}

                {#if !$disconnected}
                    <div
                        class="flex items-center h-full ml-2 group-hover:opacity-100 opacity-0"
                    >
                        {#if messageData.spotify_embed}
                            <Button
                                size="icon"
                                variant="ghost"
                                class="rounded-full w-[26px] hover:bg-secondary/60 h-[26px] p-1"
                            >
                                <a
                                    class="flex hover:underline cursor-pointer"
                                    target="_blank"
                                    href={messageData.spotify_embed.replace(
                                        '/embed/',
                                        '/'
                                    )}
                                    ><ExternalLink />
                                </a></Button
                            >
                        {/if}

                        {#if $canMessage === true}
                            <Button
                                size="icon"
                                variant="ghost"
                                class="rounded-full w-[26px] hover:bg-secondary/60 h-[26px] p-1"
                                on:click={updateReplying}
                            >
                                <Reset />
                            </Button>
                        {/if}

                        {#if $ourData.id === messageData.profile_id || $currentServer?.owner_id === $ourData.id}
                            <Dialog>
                                <DialogTrigger>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        class="rounded-full w-[26px] hover:bg-secondary/60 h-[26px] p-1"
                                    >
                                        <Trash />
                                    </Button>
                                </DialogTrigger>

                                <DialogContent>
                                    <DialogTitle>Delete message</DialogTitle>
                                    <DialogDescription
                                        >This cannot be reversed.</DialogDescription
                                    >

                                    <div class="flex w-full justify-end">
                                        <DialogClose class="mr-2"
                                            ><Button variant="outline"
                                                >Cancel</Button
                                            ></DialogClose
                                        >

                                        <DialogClose>
                                            <Button
                                                on:click={deleteMessage}
                                                variant="destructive"
                                                >Delete</Button
                                            >
                                        </DialogClose>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        {/if}
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>
