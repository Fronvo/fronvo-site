<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';
    import {
        Dialog,
        DialogClose,
        DialogContent,
        DialogDescription,
        DialogTitle,
    } from '$lib/components/ui/dialog';
    import Input from '$lib/components/ui/input/input.svelte';
    import { deletingAccount } from 'stores/modals';
    import Cookies from 'js-cookie';
    import {
        getRequestError,
        isRequestErrored,
        sendDeleteRequest,
    } from 'utilities/main';

    let processing = false;
    let errorMessage: string;
    let password = '';
    let extraText = '';

    async function deleteAccount() {
        if (extraText !== 'delete my account') return;
        if (password.length < 8) return;

        processing = true;

        const res = await sendDeleteRequest('login', { password });

        if (isRequestErrored(res)) {
            errorMessage = getRequestError(res);

            processing = false;
        } else {
            Cookies.remove('refreshToken');
            Cookies.remove('accessToken');
            localStorage.clear();

            location.href = '/';
        }
    }
</script>

<Dialog
    bind:open={$deletingAccount}
    onOpenChange={(e) => {
        $deletingAccount = e;
        password = '';
        extraText = '';
    }}
>
    <DialogContent>
        <DialogTitle>Delete account</DialogTitle>
        <DialogDescription
            >Follow these steps to delete your Fronvo account</DialogDescription
        >

        {#if errorMessage}
            <h1 class="text-destructive text-sm font-medium">{errorMessage}</h1>
        {/if}

        <Input
            bind:value={password}
            placeholder="Your password"
            type="password"
        />

        <h1 class="text-sm mt-1 select-none">
            Type <b>delete my account</b> below
        </h1>

        <Input bind:value={extraText} />

        <div class="flex">
            <DialogClose disabled={processing}
                ><Button variant="outline" disabled={processing}>Cancel</Button
                ></DialogClose
            >

            <span class="flex-1" />

            <Button
                disabled={password.length < 8 ||
                    extraText !== 'delete my account' ||
                    processing}
                variant="destructive"
                on:click={deleteAccount}>Delete account</Button
            >
        </div>
    </DialogContent>
</Dialog>
