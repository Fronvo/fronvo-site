<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';
    import {
        Dialog,
        DialogClose,
        DialogContent,
        DialogDescription,
        DialogTitle,
        DialogTrigger,
    } from '$lib/components/ui/dialog';
    import { ExclamationTriangle } from 'radix-icons-svelte';

    let open = false;
</script>

<Dialog
    bind:open
    onOpenChange={(e) => {
        open = e;
    }}
>
    <DialogTrigger asChild>
        <Button
            variant="destructive"
            class="min-w-[48px] w-[48px] min-h-[48px] h-[48px] rounded-full mt-2"
            size="icon"
            on:click={() => (open = true)}
        >
            <ExclamationTriangle size={22} />
        </Button>
    </DialogTrigger>

    <DialogContent>
        <DialogTitle>Disconnected from Fronvo</DialogTitle>
        <DialogDescription
            >Functionality will be limited until you reconnect.</DialogDescription
        >

        <div class="flex items-center">
            <DialogClose><Button>Close</Button></DialogClose>
        </div>
    </DialogContent>
</Dialog>
