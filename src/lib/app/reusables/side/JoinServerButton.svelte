<script lang="ts">
    import { goto } from '$app/navigation';
    import Button from '$lib/components/ui/button/button.svelte';
    import {
        Dialog,
        DialogClose,
        DialogContent,
        DialogDescription,
        DialogTitle,
        DialogTrigger,
    } from '$lib/components/ui/dialog';
    import Input from '$lib/components/ui/input/input.svelte';
    import { Link1 } from 'radix-icons-svelte';
    import {
        currentChannel,
        currentRoomData,
        currentRoomId,
        currentRoomLoaded,
        currentRoomMessages,
        currentServer,
        isInServer,
        serversList,
    } from 'stores/rooms';
    import {
        getRequestError,
        isRequestErrored,
        sendPostRequest,
        setTitle,
    } from 'utilities/main';

    let open = false;
    let invite = '';
    let processing = false;
    let errorMessage = '';

    async function enterJoinedServer(parsedInvite: string): Promise<void> {
        const targetServer = $serversList.find(
            (v) => v.invite === parsedInvite
        );

        if ($currentServer?.id == targetServer.id) return;

        $isInServer = true;
        $currentServer = targetServer;

        if (targetServer.channels.length > 0) {
            const channel = targetServer.channels[0];

            $currentChannel = channel;
            $currentRoomLoaded = false;
            $currentRoomLoaded = true;
            $currentRoomMessages = [];

            goto(
                `/${encodeURIComponent(parsedInvite)}/${encodeURIComponent(
                    channel.name
                )}`
            );

            setTitle(`#${channel.name} | ${$currentServer.name}`);
        } else {
            $currentChannel = undefined;
            $currentRoomId = undefined;
            $currentRoomData = undefined;

            $currentRoomMessages = [];

            goto(`/${parsedInvite}`);

            setTitle(targetServer.name);
        }
    }

    async function joinServer() {
        if (!invite) return;

        if (invite.trim().length == 0) {
            return;
        }

        let parsedInvite = invite;

        // Handle /invite/abc than straight up invite name
        if (invite.includes('/')) {
            parsedInvite = invite.split('/')[2];
        }

        processing = true;

        const res = await sendPostRequest('servers/join', {
            invite: parsedInvite,
        });

        if (isRequestErrored(res)) {
            const error = getRequestError(res);

            if (error === 'You already are in this server.') {
                enterJoinedServer(parsedInvite);

                open = false;
                invite = '';
            } else {
                errorMessage = getRequestError(res);
            }

            processing = false;
        } else {
            open = false;
            processing = false;
            invite = '';
        }
    }
</script>

<Dialog
    bind:open
    onOpenChange={() => {
        invite = '';
        errorMessage = '';
    }}
>
    <DialogTrigger asChild>
        <Button
            variant="outline"
            class="min-w-[48px] w-[48px] min-h-[48px] h-[48px] rounded-full mt-2"
            size="icon"
            on:click={() => (open = true)}
        >
            <Link1 size={19} />
        </Button>
    </DialogTrigger>

    <DialogContent>
        <DialogTitle>Join server</DialogTitle>
        <DialogDescription
            >Enter a server using an invite link</DialogDescription
        >

        {#if errorMessage}
            <h1 class="text-destructive text-sm font-medium">
                {errorMessage}
            </h1>
        {/if}

        <Input bind:value={invite} placeholder="/invite/abc" />

        <div class="flex items-center justify-end">
            <DialogClose disabled={processing}
                ><Button disabled={processing} variant="outline" class="mr-2"
                    >Cancel</Button
                ></DialogClose
            >

            <Button
                on:click={joinServer}
                disabled={processing || invite.length === 0}>Join server</Button
            >
        </div>
    </DialogContent>
</Dialog>
