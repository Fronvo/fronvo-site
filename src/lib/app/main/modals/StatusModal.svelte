<script lang="ts">
    import { updatingStatus } from 'stores/modals';
    import { ourData } from 'stores/profile';
    import {
        Dialog,
        DialogClose,
        DialogContent,
    } from '$lib/components/ui/dialog';
    import DialogTitle from '$lib/components/ui/dialog/dialog-title.svelte';
    import DialogDescription from '$lib/components/ui/dialog/dialog-description.svelte';
    import Input from '$lib/components/ui/input/input.svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import { isRequestErrored, sendPostRequest } from 'utilities/main';

    let status = $ourData?.status;

    updatingStatus.subscribe((state) => {
        if (!state) return;

        status = $ourData.status;
    });

    let updating = false;

    async function setStatus() {
        if (status.trim().length == 0) {
            return;
        }

        if (status === $ourData.status) {
            $updatingStatus = false;
            return;
        }

        updating = true;

        const res = await sendPostRequest('me/status', { status });

        if (!isRequestErrored(res)) {
            $ourData.status = status;
        }

        updating = false;

        $updatingStatus = false;
    }
</script>

<Dialog open={$updatingStatus} onOpenChange={(e) => ($updatingStatus = e)}>
    <DialogContent>
        <DialogTitle>Set profile status</DialogTitle>
        <DialogDescription>Visible to everyone for 1 day</DialogDescription>

        <Input bind:value={status} maxlength={30} />

        <div class="flex items-center justify-end">
            <DialogClose
                ><Button variant="outline" class="mr-2">Cancel</Button
                ></DialogClose
            >

            <Button disabled={updating} on:click={setStatus}>Set status</Button>
        </div>
    </DialogContent>
</Dialog>
