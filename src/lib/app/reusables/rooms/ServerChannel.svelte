<script lang="ts">
    import { goto } from '$app/navigation';
    import Button from '$lib/components/ui/button/button.svelte';
    import {
        ContextMenu,
        ContextMenuContent,
        ContextMenuItem,
        ContextMenuSeparator,
        ContextMenuTrigger,
    } from '$lib/components/ui/context-menu';
    import {
        Dialog,
        DialogClose,
        DialogContent,
        DialogDescription,
        DialogTitle,
    } from '$lib/components/ui/dialog';
    import Input from '$lib/components/ui/input/input.svelte';
    import type { Channel } from 'interfaces/all';
    import { ourData } from 'stores/profile';
    import {
        currentChannel,
        currentRoomLoaded,
        currentRoomMessages,
        currentServer,
    } from 'stores/rooms';
    import { onDestroy } from 'svelte';
    import type { Unsubscriber } from 'svelte/motion';
    import {
        sendDeleteRequest,
        sendPostRequest,
        setTitle,
    } from 'utilities/main';

    export let channel: Channel;

    let renaming = false;
    let newName = channel.name;

    let deleting = false;

    let processing = false;

    let unsubscribe: Unsubscriber;

    function enterChannel() {
        if ($currentChannel?.id == channel.id) return;

        $currentChannel = channel;
        $currentRoomLoaded = false;
        $currentRoomLoaded = true;
        $currentRoomMessages = [];

        goto(
            `/${encodeURIComponent($currentServer.invite)}/${encodeURIComponent(
                channel.name
            )}`
        );

        setTitle(`#${channel.name} | ${$currentServer.name}`);
    }

    async function renameChannel() {
        if (newName.trim() === channel.name) {
            renaming = false;

            return;
        }

        if (newName.trim().length == 0) {
            newName = channel.name;

            renaming = false;

            return;
        }

        processing = true;

        await sendPostRequest('channels/edit', {
            id: $currentServer.id,
            channelId: channel.id,
            name: newName,
        });

        processing = false;
        renaming = false;
    }

    async function deleteChannel() {
        processing = true;

        await sendDeleteRequest('channels/delete', {
            id: $currentServer.id,
            channelId: channel.id,
        });

        processing = false;
        deleting = false;
    }

    onDestroy(() => {
        if (unsubscribe) unsubscribe();
    });
</script>

{#if $currentServer?.owner_id === $ourData.id}
    <ContextMenu>
        <ContextMenuTrigger class="w-[94%] mb-2 ml-3">
            <Button
                variant="ghost"
                class={`h-[34px] w-full duration-0 flex pl-2 pr-2 justify-start prop-container ${
                    $currentChannel && $currentChannel?.id == channel.id
                        ? 'bg-accent border-accent'
                        : ''
                }`}
                on:click={enterChannel}
                on:keydown={enterChannel}
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
        </ContextMenuTrigger>

        <ContextMenuContent class="w-[150px]">
            <ContextMenuItem
                on:click={() => {
                    renaming = true;
                    newName = channel.name;
                }}>Rename</ContextMenuItem
            >

            <ContextMenuSeparator />

            <ContextMenuItem on:click={() => (deleting = true)}
                >Delete</ContextMenuItem
            >
        </ContextMenuContent>
    </ContextMenu>
{:else}
    <Button
        variant="outline"
        class={`mb-2 ml-3 h-[34px] w-[94%] duration-0 flex pl-2 pr-2 justify-start prop-container ${
            $currentChannel && $currentChannel?.id == channel.id
                ? 'bg-accent border-accent'
                : ''
        }`}
        on:click={enterChannel}
        on:keydown={enterChannel}
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
{/if}

<Dialog
    bind:open={renaming}
    onOpenChange={(e) => {
        renaming = e;
        newName = channel.name;
    }}
>
    <DialogContent>
        <DialogTitle>Rename channel</DialogTitle>
        <DialogDescription
            >Choose a new name for <b>{channel.name}</b></DialogDescription
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

            <Input maxlength={20} bind:value={newName} />
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

<Dialog bind:open={deleting} onOpenChange={(e) => (deleting = e)}>
    <DialogContent>
        <DialogTitle>Delete channel</DialogTitle>
        <DialogDescription
            >Are you sure you want to delete the channel <b>{channel.name}</b
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
