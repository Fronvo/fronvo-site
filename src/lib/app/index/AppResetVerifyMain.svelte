<script lang="ts">
    import { goto } from '$app/navigation';
    import Button from '$lib/components/ui/button/button.svelte';
    import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
    } from '$lib/components/ui/card';
    import Input from '$lib/components/ui/input/input.svelte';
    import Label from '$lib/components/ui/label/label.svelte';
    import { promotedToRVerify, resetVerifyEmail } from 'stores/index';
    import { socket } from 'stores/main';
    import { onMount } from 'svelte';
    import {
        getRequestError,
        isRequestErrored,
        sendPostRequest,
    } from 'utilities/main';

    let codeInput: HTMLInputElement;
    let passwordInput: HTMLInputElement;

    let code = '';
    let password = '';
    let errorMessage: string;

    let processing = false;
    let mountReady = false;

    onMount(() => {
        setTimeout(() => {
            codeInput.addEventListener('keydown', (e) => {
                if (e.key == 'Enter') reset();
            });

            passwordInput.addEventListener('keydown', (e) => {
                if (e.key == 'Enter') reset();
            });
        }, 0);

        mountReady = true;
    });

    async function reset() {
        if (!code || !password) return;

        processing = true;

        const res = await sendPostRequest(
            'reset/verify',
            { email: $resetVerifyEmail, newPassword: password, code },
            true
        );

        if (isRequestErrored(res)) {
            errorMessage = getRequestError(res);

            processing = false;
        } else {
            $promotedToRVerify = false;

            goto('/auth?for=login', {
                replaceState: true,
            });
        }
    }
</script>

{#if mountReady}
    <Card
        class="xs:w-[300px] fixed top-0 right-0 left-0 bottom-0 m-auto w-[400px] h-max"
    >
        <CardHeader>
            <CardTitle>Password reset verification</CardTitle>
            <CardDescription
                >Finish resetting your Fronvo account password</CardDescription
            >
        </CardHeader>
        <CardContent class="space-y-2">
            <div class="space-y-1">
                {#if errorMessage}
                    <h1 class="text-destructive font-semibold mb-4 text-sm">
                        {errorMessage}
                    </h1>
                {/if}

                <Label for="email">Verification code</Label>
                <Input bind:value={code} disabled={processing} maxlength={6} />
            </div>
            <div class="space-y-1">
                <Label for="password">New account password</Label>

                <Input
                    bind:value={password}
                    disabled={processing}
                    type="password"
                />
            </div>
        </CardContent>
        <CardFooter>
            <Button
                disabled={code.length !== 6 ||
                    password.length < 8 ||
                    processing}
                on:click={reset}>Finish setup</Button
            >
        </CardFooter>
    </Card>
{/if}
