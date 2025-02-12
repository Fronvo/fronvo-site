<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';
    import {
        Dialog,
        DialogTrigger,
        DialogContent,
        DialogClose,
        DialogTitle,
        DialogDescription,
    } from '$lib/components/ui/dialog';
    import Input from '$lib/components/ui/input/input.svelte';
    import { Plus } from 'radix-icons-svelte';
    import {
        getRequestError,
        isRequestErrored,
        sendPostRequest,
    } from 'utilities/main';

    let open = false;
    let name = '';
    let processing = false;
    let errorMessage = '';

    async function createServer() {
        if (!name) return;

        if (name.trim().length == 0) {
            return;
        }

        processing = true;

        const res = await sendPostRequest('servers/create', { name });

        if (isRequestErrored(res)) {
            errorMessage = getRequestError(res);
            processing = false;
        } else {
            open = false;
            name = '';
            processing = false;
        }
    }
</script>

<Dialog
    bind:open
    onOpenChange={() => {
        name = '';
        errorMessage = '';
    }}
>
    <DialogTrigger asChild>
        <Button
            variant="outline"
            class="min-w-[48px] w-[48px] min-h-[48px] h-[48px] rounded-full mt-1"
            size="icon"
            on:click={() => (open = true)}
        >
            <Plus size={19} />
        </Button>
    </DialogTrigger>

    <DialogContent>
        <DialogTitle>Create server</DialogTitle>
        <DialogDescription>Start a new community on Fronvo</DialogDescription>

        {#if errorMessage}
            <h1 class="text-destructive text-sm font-medium">
                {errorMessage}
            </h1>
        {/if}

        <Input bind:value={name} placeholder="Server name" />

        <div class="flex items-center justify-end">
            <DialogClose disabled={processing}
                ><Button disabled={processing} variant="outline" class="mr-2"
                    >Cancel</Button
                ></DialogClose
            >

            <Button
                on:click={createServer}
                disabled={processing || name.length === 0}>Create server</Button
            >
        </div>
    </DialogContent>
</Dialog>
