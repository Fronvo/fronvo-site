<script lang="ts">
    import { currentServer } from 'stores/rooms';
    import PropChannel from '../rooms/PropChannel.svelte';
    import ServerChannel from '../rooms/ServerChannel.svelte';
    import { cachedAccountData, isMobile } from 'stores/main';
    import Button from '$lib/components/ui/button/button.svelte';
    import {
        ChatBubble,
        ChevronDown,
        Copy,
        Exit,
        HamburgerMenu,
        Link1,
        LockClosed,
        LockOpen1,
        MagnifyingGlass,
        PaperPlane,
        Pencil1,
        Person,
        Plus,
        Trash,
        Update,
    } from 'radix-icons-svelte';
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuSeparator,
        DropdownMenuTrigger,
    } from '$lib/components/ui/dropdown-menu';
    import { ourData } from 'stores/profile';
    import {
        BannedMember,
        Channel,
        FronvoAccount,
        Member,
    } from 'interfaces/all';
    import {
        findCachedAccount,
        isRequestErrored,
        sendDeleteRequest,
        sendPostRequest,
    } from 'utilities/main';
    import {
        Dialog,
        DialogClose,
        DialogContent,
        DialogDescription,
        DialogTitle,
    } from '$lib/components/ui/dialog';
    import PreviewInvite from '../all/PreviewInvite.svelte';
    import { onDestroy, onMount } from 'svelte';
    import Input from '$lib/components/ui/input/input.svelte';
    import {
        Tooltip,
        TooltipContent,
        TooltipTrigger,
    } from '$lib/components/ui/tooltip';
    import { Unsubscriber } from 'svelte/motion';
    import PreviewLarge from '../all/PreviewLarge.svelte';
    import { targetProfileModal } from 'stores/modals';

    let showingProfile = false;
    let targetObj: FronvoAccount;

    let inviting = false;
    let inviteCopied = false;
    let inviteFilter = '';

    let editing = false;
    let editingName = $currentServer?.name;

    let channels = false;
    let channelObj: Channel;
    let channelCreating = false;
    let channelRenaming = false;
    let channelNewName = '';
    let channelDeleting = false;

    let members = false;
    let memberObj: Member;

    let kicking = false;
    let banning = false;

    let bannedMembers = false;
    let bannedMemberObj: BannedMember;
    let unbanning = false;

    let leaving = false;

    let deleting = false;
    let deletingName = '';

    let processing = false;

    let friendsInfo: FronvoAccount[] = [];
    let friendsLoadingFinished = false;

    let unsubscriber: Unsubscriber;

    async function loadFriends(): Promise<void> {
        friendsInfo = [];

        if ($ourData.friends.length == 0) {
            friendsLoadingFinished = true;
            return;
        }

        // Fetch all room members, notify UI once finished
        for (const friendIndex in $ourData.friends) {
            findCachedAccount(
                $ourData.friends[friendIndex],
                $cachedAccountData
            ).then((data) => {
                friendsInfo.push(data);

                checkLoadingDone();
            });
        }

        function checkLoadingDone(): void {
            // Finish loading
            if (friendsInfo.length == $ourData?.friends.length) {
                friendsLoadingFinished = true;

                friendsInfo = friendsInfo;
            }
        }
    }

    function copyInvite(): void {
        navigator.clipboard.writeText(`/invite/${$currentServer?.invite}`);

        inviteCopied = true;
    }

    async function regenerateInvite() {
        processing = true;

        await sendPostRequest('invites/regenerate', { id: $currentServer.id });

        processing = false;
    }

    async function toggleInvites() {
        processing = true;

        await sendPostRequest(
            `invites/${$currentServer.invites_disabled ? 'enable' : 'disable'}`,
            { id: $currentServer.id }
        );

        processing = false;
    }

    onMount(loadFriends);

    unsubscriber = currentServer.subscribe((state) => {
        if (!state) return;
    });

    onDestroy(() => {
        if (unsubscriber) unsubscriber();
    });

    async function createChannel() {
        processing = true;

        await sendPostRequest('channels/create', {
            id: $currentServer?.id,
            name: channelNewName,
        });

        channelCreating = false;
        processing = false;
        channelNewName = '';
    }

    async function renameChannel() {
        if (channelNewName.trim() === channelObj.name) {
            channelRenaming = false;

            return;
        }

        if (channelNewName.trim().length == 0) {
            channelRenaming = false;

            return;
        }

        processing = true;

        await sendPostRequest('channels/edit', {
            id: $currentServer.id,
            channelId: channelObj.id,
            name: channelNewName,
        });

        channelRenaming = false;
        channelNewName = '';
        processing = false;
    }

    async function deleteChannel() {
        processing = true;

        await sendDeleteRequest('channels/delete', {
            id: $currentServer.id,
            channelId: channelObj.id,
        });

        channelDeleting = false;
        processing = false;
    }

    async function kickMember() {
        processing = true;

        await sendPostRequest('members/kick', {
            id: $currentServer.id,
            memberId: memberObj.id,
        });

        kicking = false;
        processing = false;
    }

    async function banMember() {
        processing = true;

        await sendPostRequest('members/ban', {
            id: $currentServer.id,
            memberId: memberObj.id,
        });

        banning = false;
        processing = false;
    }

    async function unbanMember() {
        processing = true;

        await sendPostRequest('members/unban', {
            id: $currentServer.id,
            memberId: bannedMemberObj.id,
        });

        if ($currentServer?.banned_members.length - 1 === 0) {
            bannedMembers = false;
        }

        unbanning = false;
        processing = false;
    }

    async function editServer() {
        if (!editingName) return;

        processing = true;

        await sendPostRequest('servers/edit', {
            id: $currentServer.id,
            name: editingName,
        });

        editing = false;
        processing = false;
    }

    async function deleteServer() {
        if (!deletingName) return;

        if (deletingName.trim().length == 0) return;

        if (deletingName !== $currentServer.name) return;

        processing = true;

        const res = await sendDeleteRequest('servers/delete', {
            id: $currentServer.id,
        });

        if (!isRequestErrored(res)) {
            deleting = false;
        }

        processing = false;
    }

    async function leaveServer() {
        processing = true;

        const res = await sendDeleteRequest('servers/leave', {
            id: $currentServer.id,
        });

        if (!isRequestErrored(res)) {
            deleting = false;
        }

        processing = false;
    }
</script>

<div
    class={`w-[235px] select-none border-l border-r ${
        $isMobile ? 'mobile' : ''
    }`}
>
    <DropdownMenu>
        <DropdownMenuTrigger class="w-full cursor-default h-[44px]">
            <Button
                variant="ghost"
                class={`w-full m-auto flex justify-start rounded-none h-[44px] h-full`}
            >
                <h1 class="flex-1 text-start">{$currentServer.name}</h1>

                <ChevronDown size={18} />
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
            class="w-[210px] mt-1 shadow-2xl dark:shadow-black"
        >
            <DropdownMenuItem on:click={() => (inviting = true)}>
                Invite friends <span class="flex-1" />
                <PaperPlane /></DropdownMenuItem
            >

            <DropdownMenuSeparator />

            {#if $currentServer?.owner_id === $ourData.id}
                <DropdownMenuItem on:click={() => (editing = true)}>
                    Edit <span class="flex-1" />
                    <Pencil1 /></DropdownMenuItem
                >

                <DropdownMenuItem on:click={() => (channels = true)}>
                    Channels <span class="flex-1" />
                    <ChatBubble /></DropdownMenuItem
                >

                <DropdownMenuItem on:click={() => (members = true)}>
                    Members <span class="flex-1" />
                    <Person /></DropdownMenuItem
                >

                <DropdownMenuSeparator />

                <DropdownMenuItem on:click={() => (deleting = true)}>
                    Delete server <span class="flex-1" />
                    <Trash /></DropdownMenuItem
                >
            {:else}
                <DropdownMenuItem on:click={() => (leaving = true)}>
                    Leave server <span class="flex-1" />
                    <Exit /></DropdownMenuItem
                >
            {/if}
        </DropdownMenuContent>
    </DropdownMenu>

    <Separator class="mb-2 w-full" />

    <div class="channels flex flex-col overflow-y-auto h-[95.5vh] mr-3">
        {#if $currentServer.channels.length > 0}
            {#each $currentServer.channels as channel}
                <ServerChannel {channel} />
            {/each}
        {:else}
            {#each { length: 10 } as _}
                <PropChannel />
            {/each}
        {/if}
    </div>
</div>

<Dialog
    bind:open={inviting}
    onOpenChange={(e) => {
        inviting = e;
        inviteCopied = false;
        inviteFilter = '';
    }}
>
    <DialogContent>
        <DialogTitle
            >{$ourData.id === $currentServer?.owner_id ||
            !$currentServer?.invites_disabled
                ? `Invite to ${$currentServer?.name}`
                : `Can\'t invite to ${$currentServer?.name}`}</DialogTitle
        >
        <DialogDescription
            >{$ourData.id === $currentServer?.owner_id ||
            !$currentServer?.invites_disabled
                ? `Select friends to send an invite to`
                : `Invites have been disabled for this server.`}</DialogDescription
        >

        {#if $ourData.id === $currentServer?.owner_id || !$currentServer?.invites_disabled}
            {#if $ourData.friends.length > 0 && !$currentServer?.invites_disabled}
                {#if friendsLoadingFinished}
                    <div class="flex flex-col max-h-[50vh] overflow-y-auto">
                        <div
                            class="flex items-center bg-secondary/40 pr-2 pl-2 mb-4 rounded-lg"
                        >
                            <MagnifyingGlass
                                class="translate-y-[1px]"
                                size={18}
                            />
                            <Input
                                bind:value={inviteFilter}
                                placeholder="Search for friends..."
                                class="border-none text-xs pl-2"
                            />
                        </div>

                        {#each friendsInfo as { avatar, id }}
                            {#if !inviteFilter || (inviteFilter && id
                                        .toLowerCase()
                                        .includes(inviteFilter?.toLowerCase()))}
                                <PreviewInvite
                                    {avatar}
                                    profileId={id}
                                    isInServer={$currentServer?.members
                                        .map((v) => v.id)
                                        .includes(id)}
                                    isBanned={$currentServer?.banned_members
                                        ?.map((v) => v.id)
                                        .includes(id)}
                                    invite={$currentServer?.invite}
                                />
                            {/if}
                        {/each}
                    </div>
                {/if}
            {/if}

            <Separator />

            <div
                class={`${
                    $isMobile ? 'w-max m-auto justify-center' : 'w-[95%]'
                } flex items-center p-1.5 pr-3 pl-3 rounded-3xl bg-secondary/40 m-auto`}
            >
                {#if !$isMobile}
                    <Link1 size={20} class="mr-2" />

                    <h1
                        class="text-[0.8rem] max-w-[125px] overflow-hidden text-ellipsis"
                    >
                        /invite/{$currentServer?.invite}
                    </h1>

                    <span class="flex-1" />
                {/if}

                {#if $ourData.id === $currentServer?.owner_id}
                    <Button
                        size="sm"
                        variant="destructive"
                        class="rounded-full mr-1"
                        on:click={regenerateInvite}
                        disabled={processing}
                        ><Update class="mr-2" />
                        Regenerate</Button
                    >
                {/if}

                <Button
                    size="sm"
                    class="rounded-full mr-1"
                    on:click={copyInvite}
                    ><Copy class="mr-2" />
                    {inviteCopied ? 'Copied' : 'Copy'}</Button
                >
                {#if $ourData.id === $currentServer?.owner_id}
                    <Tooltip>
                        <TooltipTrigger>
                            <Button
                                disabled={processing}
                                size="sm"
                                class="rounded-full pr-2.5 pl-2.5"
                                on:click={toggleInvites}
                            >
                                {#if $currentServer?.invites_disabled}
                                    <LockClosed />
                                {:else}
                                    <LockOpen1 />
                                {/if}
                            </Button>
                        </TooltipTrigger>

                        <TooltipContent
                            >{$currentServer?.invites_disabled
                                ? 'Enable'
                                : 'Disable'} invite</TooltipContent
                        >
                    </Tooltip>
                {/if}
            </div>
        {:else}
            <div>
                <DialogClose
                    ><Button variant="outline">Close</Button></DialogClose
                >
            </div>
        {/if}
    </DialogContent>
</Dialog>

<Dialog
    bind:open={editing}
    onOpenChange={(e) => {
        editing = e;
        editingName = $currentServer?.name;
    }}
>
    <DialogContent>
        <DialogTitle>Edit server</DialogTitle>
        <DialogDescription>Adjust server settings</DialogDescription>

        {#if $currentServer?.avatar}
            <img
                id="icon"
                src={`${$currentServer?.avatar}/tr:w-96:h-96`}
                alt={`${$currentServer?.name}\'s icon'`}
                draggable={false}
            />
        {:else}
            <Button
                variant="outline"
                class={`w-[96px] h-[96px] rounded-full cursor-default m-auto hover:bg-transparent ${
                    $isMobile ? 'mobile-placeholder' : ''
                }`}
                id="icon"
            >
                <h1 class="text-xl">
                    {editingName[0] || ''}{editingName[1] || ''}
                </h1></Button
            >

            <!-- TODO: Enable in v3 -->
            <Button disabled class="w-max m-auto translate-y-[-10px]" size="sm"
                >Upload image</Button
            >
        {/if}

        <Input
            placeholder="Server name"
            bind:value={editingName}
            maxlength={15}
        />

        <div class="flex w-full justify-end">
            <DialogClose disabled={processing} class="mr-2"
                ><Button disabled={processing} variant="outline">Cancel</Button
                ></DialogClose
            >

            <Button disabled={processing} on:click={editServer}>
                Update server</Button
            >
        </div>
    </DialogContent>
</Dialog>

<Dialog bind:open={channels} onOpenChange={(e) => (channels = e)}>
    <DialogContent>
        <DialogTitle>Channels</DialogTitle>
        <DialogDescription>Organise server channels</DialogDescription>

        <div class="overflow-y-auto max-h-[60vh]">
            {#each $currentServer?.channels as channel}
                <div class="flex">
                    <Button
                        variant="outline"
                        class={`mb-2 mr-2 flex flex-1 justify-start cursor-default`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            class="w-[18px] h-[18px] mr-2"
                            ><path
                                fill="currentColor"
                                fill-rule="evenodd"
                                d="M10.723 3.2a.75.75 0 1 0-1.446-.4L7.763 8.25H4a.75.75 0 1 0 0 1.5h3.347l-1.528 5.5H2a.75.75 0 0 0 0 1.5h3.402L4.277 20.8a.75.75 0 0 0 1.446.4l1.236-4.45h7.443l-1.125 4.05a.75.75 0 0 0 1.446.4l1.236-4.45H20a.75.75 0 1 0 0-1.5h-3.624l1.527-5.5H22a.75.75 0 0 0 0-1.5h-3.68l1.403-5.05a.75.75 0 1 0-1.446-.4l-1.514 5.45H9.32zm4.096 12.05l1.528-5.5H8.903l-1.527 5.5z"
                                clip-rule="evenodd"
                            /></svg
                        >

                        <h1 class="text-[0.8rem]">{channel.name}</h1>
                    </Button>

                    <Button
                        on:click={() => {
                            channelObj = channel;
                            channelNewName = channel.name;

                            channelRenaming = true;
                        }}
                        class="mr-2"
                        size="icon"
                        variant="outline"><Pencil1 /></Button
                    >

                    <Button
                        on:click={() => {
                            channelObj = channel;

                            channelDeleting = true;
                        }}
                        size="icon"
                        variant="outline"><Trash /></Button
                    >
                </div>
            {/each}
        </div>

        <div class="flex w-full justify-end">
            <DialogClose disabled={processing} class="mr-2"
                ><Button disabled={processing} variant="outline">Cancel</Button
                ></DialogClose
            >

            <span class="flex-1" />

            <Button
                disabled={processing}
                on:click={() => {
                    channelCreating = true;
                    channelNewName = '';
                }}
            >
                <Plus class="mr-2" /> Create channel</Button
            >
        </div>
    </DialogContent>
</Dialog>

<Dialog
    bind:open={channelCreating}
    onOpenChange={(e) => {
        channelCreating = e;
        channelNewName = '';
    }}
>
    <DialogContent>
        <DialogTitle>Create channel</DialogTitle>
        <DialogDescription
            >Create a new channel in this server</DialogDescription
        >

        <div class="flex items-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                class="w-[20px] h-[20px] mr-2"
                ><path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M10.723 3.2a.75.75 0 1 0-1.446-.4L7.763 8.25H4a.75.75 0 1 0 0 1.5h3.347l-1.528 5.5H2a.75.75 0 0 0 0 1.5h3.402L4.277 20.8a.75.75 0 0 0 1.446.4l1.236-4.45h7.443l-1.125 4.05a.75.75 0 0 0 1.446.4l1.236-4.45H20a.75.75 0 1 0 0-1.5h-3.624l1.527-5.5H22a.75.75 0 0 0 0-1.5h-3.68l1.403-5.05a.75.75 0 1 0-1.446-.4l-1.514 5.45H9.32zm4.096 12.05l1.528-5.5H8.903l-1.527 5.5z"
                    clip-rule="evenodd"
                /></svg
            >

            <Input maxlength={20} bind:value={channelNewName} />
        </div>

        <div class="flex w-full justify-end">
            <DialogClose disabled={processing} class="mr-2"
                ><Button disabled={processing} variant="outline">Cancel</Button
                ></DialogClose
            >

            <span class="flex-1" />

            <Button
                disabled={processing || channelNewName.length === 0}
                on:click={createChannel}>Create</Button
            >
        </div>
    </DialogContent>
</Dialog>

<Dialog
    bind:open={channelRenaming}
    onOpenChange={(e) => {
        channelRenaming = e;
    }}
>
    <DialogContent>
        <DialogTitle>Rename channel</DialogTitle>
        <DialogDescription
            >Choose a new name for <b>{channelObj.name}</b></DialogDescription
        >

        <div class="flex items-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                class="w-[20px] h-[20px] mr-2"
                ><path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M10.723 3.2a.75.75 0 1 0-1.446-.4L7.763 8.25H4a.75.75 0 1 0 0 1.5h3.347l-1.528 5.5H2a.75.75 0 0 0 0 1.5h3.402L4.277 20.8a.75.75 0 0 0 1.446.4l1.236-4.45h7.443l-1.125 4.05a.75.75 0 0 0 1.446.4l1.236-4.45H20a.75.75 0 1 0 0-1.5h-3.624l1.527-5.5H22a.75.75 0 0 0 0-1.5h-3.68l1.403-5.05a.75.75 0 1 0-1.446-.4l-1.514 5.45H9.32zm4.096 12.05l1.528-5.5H8.903l-1.527 5.5z"
                    clip-rule="evenodd"
                /></svg
            >

            <Input maxlength={20} bind:value={channelNewName} />
        </div>

        <div class="flex w-full justify-end">
            <DialogClose disabled={processing} class="mr-2"
                ><Button disabled={processing} variant="outline">Cancel</Button
                ></DialogClose
            >

            <Button disabled={processing} on:click={renameChannel}
                >Rename</Button
            >
        </div>
    </DialogContent>
</Dialog>

<Dialog bind:open={channelDeleting} onOpenChange={(e) => (channelDeleting = e)}>
    <DialogContent>
        <DialogTitle>Delete channel</DialogTitle>
        <DialogDescription
            >Are you sure you want to delete the channel <b>{channelObj.name}</b
            >?</DialogDescription
        >

        <div class="flex w-full justify-end">
            <DialogClose disabled={processing} class="mr-2"
                ><Button disabled={processing} variant="outline">Cancel</Button
                ></DialogClose
            >

            <Button
                disabled={processing}
                on:click={deleteChannel}
                variant="destructive"
            >
                Delete</Button
            >
        </div>
    </DialogContent>
</Dialog>

<Dialog bind:open={members} onOpenChange={(e) => (members = e)}>
    <DialogContent>
        <DialogTitle>Members</DialogTitle>
        <DialogDescription>Manage server members</DialogDescription>

        <div class="overflow-y-auto max-h-[60vh]">
            {#each $currentServer.members as member}
                <div class="flex mb-2">
                    <Button
                        variant="outline"
                        class={`flex items-center w-[400px] h-[42px] justify-start pl-2.5 pr-2.5`}
                        on:click={() => {
                            targetObj = member;
                            $targetProfileModal = member;

                            showingProfile = true;
                        }}
                    >
                        <img
                            src={member.avatar
                                ? `${member.avatar}/tr:w-56:h-56`
                                : '/images/avatar.svg'}
                            alt={`${member.id}'s avatar`}
                            draggable={false}
                            class={`${
                                !member.avatar &&
                                'bg-primary border-accent border-[1px] p-[3px]'
                            } w-[28px] h-[28px] mr-2 rounded-full`}
                        />

                        <div class="bottom-container">
                            <h1 class="text-sm">{member.username}</h1>
                        </div>
                    </Button>

                    {#if member.id !== $ourData.id}
                        <DropdownMenu>
                            <DropdownMenuTrigger class="h-max m-auto">
                                <Button
                                    class="m-auto pr-3 pl-3"
                                    variant="outline"><HamburgerMenu /></Button
                                >
                            </DropdownMenuTrigger>

                            <DropdownMenuContent>
                                <DropdownMenuItem
                                    on:click={() => {
                                        targetObj = member;
                                        $targetProfileModal = member;

                                        showingProfile = true;
                                    }}>View profile</DropdownMenuItem
                                >

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    on:click={() => {
                                        memberObj = member;

                                        kicking = true;
                                    }}>Kick</DropdownMenuItem
                                >

                                <DropdownMenuItem
                                    on:click={() => {
                                        memberObj = member;

                                        banning = true;
                                    }}>Ban</DropdownMenuItem
                                >
                            </DropdownMenuContent>
                        </DropdownMenu>
                    {/if}
                </div>
            {/each}
        </div>

        <div class="flex w-full">
            <DialogClose disabled={processing} class="mr-2"
                ><Button disabled={processing} variant="outline">Close</Button
                ></DialogClose
            >

            <span class="flex-1" />

            {#if $currentServer?.banned_members?.length > 0}
                <Button
                    on:click={() => {
                        bannedMembers = true;
                    }}>View bans</Button
                >
            {/if}
        </div>
    </DialogContent>
</Dialog>

<Dialog bind:open={kicking} onOpenChange={(e) => (kicking = e)}>
    <DialogContent>
        <DialogTitle>Kick member</DialogTitle>
        <DialogDescription
            >Are you sure you want to kick <b>{memberObj.id}</b> from
            <b>{$currentServer?.name}</b>?</DialogDescription
        >

        <div class="flex w-full">
            <DialogClose disabled={processing} class="mr-2"
                ><Button disabled={processing} variant="outline">Cancel</Button
                ></DialogClose
            >

            <span class="flex-1" />

            <Button
                disabled={processing}
                class="mr-2"
                on:click={kickMember}
                variant="destructive">Kick</Button
            >
        </div>
    </DialogContent>
</Dialog>

<Dialog bind:open={banning} onOpenChange={(e) => (banning = e)}>
    <DialogContent>
        <DialogTitle>Ban member</DialogTitle>
        <DialogDescription
            >Are you sure you want to ban <b>{memberObj.id}</b> from
            <b>{$currentServer?.name}</b>?</DialogDescription
        >

        <div class="flex w-full">
            <DialogClose disabled={processing} class="mr-2"
                ><Button disabled={processing} variant="outline">Cancel</Button
                ></DialogClose
            >

            <span class="flex-1" />

            <Button
                disabled={processing}
                class="mr-2"
                on:click={banMember}
                variant="destructive">Ban</Button
            >
        </div>
    </DialogContent>
</Dialog>

<Dialog bind:open={bannedMembers} onOpenChange={(e) => (banning = e)}>
    <DialogContent>
        <DialogTitle>Banned members</DialogTitle>
        <DialogDescription>Manage banned server members</DialogDescription>

        <div class="overflow-y-auto max-h-[60vh]">
            {#each $currentServer.banned_members as member}
                <div class="flex">
                    <Button
                        variant="outline"
                        class={`flex items-center w-[400px] justify-start p-6 pl-2.5 pr-2.5 mr-2`}
                        on:click={() => {
                            targetObj = member;
                            $targetProfileModal = member;

                            showingProfile = true;
                        }}
                    >
                        <img
                            src={member.avatar
                                ? `${member.avatar}/tr:w-72:h-72`
                                : '/images/avatar.svg'}
                            alt={`${member.id}'s avatar`}
                            draggable={false}
                            class={`${
                                !member.avatar &&
                                'bg-primary border-accent border-[1px] p-[3px]'
                            } w-[36px] h-[36px] mr-2 rounded-full`}
                        />

                        <div class="bottom-container">
                            <h1 class="text-sm">
                                {member.username} ({member.id})
                            </h1>
                        </div>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger class="h-max m-auto">
                            <Button class="m-auto pr-3 pl-3" variant="outline"
                                ><HamburgerMenu /></Button
                            >
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            <DropdownMenuItem
                                on:click={() => {
                                    targetObj = member;
                                    $targetProfileModal = member;

                                    showingProfile = true;
                                }}>View profile</DropdownMenuItem
                            >

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                on:click={() => {
                                    bannedMemberObj = member;

                                    unbanning = true;
                                }}>Unban</DropdownMenuItem
                            >
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            {/each}
        </div>

        <div class="flex w-full">
            <DialogClose disabled={processing} class="mr-2"
                ><Button disabled={processing} variant="outline">Close</Button
                ></DialogClose
            >
        </div>
    </DialogContent>
</Dialog>

<Dialog bind:open={unbanning} onOpenChange={(e) => (unbanning = e)}>
    <DialogContent>
        <DialogTitle>Unban member</DialogTitle>
        <DialogDescription
            >Are you sure you want to unban <b>{bannedMemberObj.id}</b
            >?</DialogDescription
        >

        <div class="flex w-full">
            <DialogClose disabled={processing} class="mr-2"
                ><Button disabled={processing} variant="outline">Cancel</Button
                ></DialogClose
            >

            <span class="flex-1" />

            <Button
                disabled={processing}
                class="mr-2"
                on:click={unbanMember}
                variant="destructive">Unban</Button
            >
        </div>
    </DialogContent>
</Dialog>

<Dialog
    bind:open={deleting}
    onOpenChange={(e) => {
        deleting = e;
        deletingName = '';
    }}
>
    <DialogContent>
        <DialogTitle>Delete server</DialogTitle>
        <DialogDescription
            >Are you sure you want to delete <b>{$currentServer?.name}</b
            >?</DialogDescription
        >

        <Input
            disabled={processing}
            bind:value={deletingName}
            placeholder="Server name"
        />

        <div class="flex w-full justify-end">
            <DialogClose disabled={processing} class="mr-2"
                ><Button disabled={processing} variant="outline">Cancel</Button
                ></DialogClose
            >

            <Button
                disabled={processing ||
                    deletingName.length === 0 ||
                    deletingName !== $currentServer?.name}
                on:click={deleteServer}
                variant="destructive"
            >
                Delete server</Button
            >
        </div>
    </DialogContent>
</Dialog>

<Dialog bind:open={leaving} onOpenChange={(e) => (leaving = e)}>
    <DialogContent>
        <DialogTitle>Leave server</DialogTitle>
        <DialogDescription
            >Are you sure you want to leave <b>{$currentServer?.name}</b
            >?</DialogDescription
        >

        <div class="flex w-full justify-end">
            <DialogClose disabled={processing} class="mr-2"
                ><Button disabled={processing} variant="outline">Cancel</Button
                ></DialogClose
            >

            <Button
                disabled={processing}
                on:click={leaveServer}
                variant="destructive"
            >
                Leave server</Button
            >
        </div>
    </DialogContent>
</Dialog>

<Dialog
    bind:open={showingProfile}
    onOpenChange={(e) => {
        showingProfile = e;
    }}
>
    <DialogContent>
        <PreviewLarge profileData={targetObj} />
    </DialogContent>
</Dialog>
