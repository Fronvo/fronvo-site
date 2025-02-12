<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';
    import {
        Dialog,
        DialogClose,
        DialogContent,
        DialogDescription,
        DialogTitle,
    } from '$lib/components/ui/dialog';
    import { requestingData } from 'stores/modals';
    import { isRequestErrored, sendPostRequest } from 'utilities/main';

    let processing = false;
    let errored = false;

    async function requestData() {
        processing = true;

        const res = await sendPostRequest('me/data');

        if (isRequestErrored(res)) {
            errored = true;
        } else {
            $requestingData = false;
        }

        processing = false;
    }
</script>

<Dialog
    bind:open={$requestingData}
    onOpenChange={(e) => {
        $requestingData = e;
        errored = false;
    }}
>
    <DialogContent>
        <DialogTitle>Request data</DialogTitle>
        <DialogDescription
            >Would you like to be sent an email with your Fronvo data attached?</DialogDescription
        >

        {#if errored}
            <h1 class="text-destructive text-sm font-medium">
                You can request your data only once every 30 days.
            </h1>
        {/if}

        <div class="flex">
            <DialogClose disabled={processing}
                ><Button disabled={processing} variant="outline">Cancel</Button
                ></DialogClose
            >

            <span class="flex-1" />

            <Button disabled={processing} on:click={requestData}
                >Request data</Button
            >
        </div>
    </DialogContent>
</Dialog>
