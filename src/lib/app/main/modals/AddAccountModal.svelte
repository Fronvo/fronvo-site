<script lang="ts">
    import { addingAccount, switchingAccounts } from 'stores/modals';
    import {
        addSavedAccount,
        getRequestError,
        isRequestErrored,
        sendPostRequest,
        sendRequest,
    } from 'utilities/main';
    import { ourData } from 'stores/profile';
    import {
        Dialog,
        DialogClose,
        DialogContent,
        DialogDescription,
        DialogTitle,
    } from '$lib/components/ui/dialog';
    import { Button } from '$lib/components/ui/button';
    import Input from '$lib/components/ui/input/input.svelte';
    import Label from '$lib/components/ui/label/label.svelte';
    import Cookies from 'js-cookie';

    let email: string;
    let password: string;
    let errorMessage: string;

    let processing = false;

    async function login() {
        // Data validation
        if (!email || !password) return;

        if (password.length < 8) {
            errorMessage = 'Password must contain atleast 8 characters';

            return;
        }

        processing = true;

        const res = await sendPostRequest('login', { email, password }, true);

        if (isRequestErrored(res)) {
            errorMessage = getRequestError(res);

            processing = false;
        } else {
            const res2 = await sendRequest('me', false, res.refreshToken);

            if (isRequestErrored(res2)) {
                processing = false;
                $addingAccount = false;
                $switchingAccounts = true;
            } else {
                addSavedAccount(
                    $ourData,
                    Cookies.get('refreshToken'),
                    res2.profileData.avatar,
                    res2.profileData.id,
                    res.refreshToken
                );

                processing = false;
                $addingAccount = false;
                $switchingAccounts = true;
            }
        }
    }

    addingAccount.subscribe(() => {
        email = '';
        password = '';
        errorMessage = '';
    });
</script>

<Dialog open={$addingAccount} onOpenChange={(e) => ($addingAccount = e)}>
    <DialogContent>
        <DialogTitle>Add account</DialogTitle>
        <DialogDescription
            >Save an account to switch to easily in the future</DialogDescription
        >

        {#if errorMessage}
            <h1 class="text-destructive text-sm font-semibold">
                {errorMessage}
            </h1>
        {/if}

        <div class="space-y-1">
            <Label for="email">Email</Label>
            <Input
                bind:value={email}
                id="email"
                type="email"
                disabled={processing}
            />
        </div>
        <div class="space-y-1">
            <Label for="password">Password</Label>
            <Input
                bind:value={password}
                type="password"
                id="password"
                disabled={processing}
            />
        </div>

        <div class="flex items-center">
            <DialogClose
                ><Button disabled={processing} variant="outline" class="mr-2"
                    >Cancel</Button
                ></DialogClose
            >

            <span class="flex-1" />

            <Button disabled={processing} on:click={login}>Login</Button>
        </div>
    </DialogContent>
</Dialog>
