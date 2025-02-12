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
    import Cookies from 'js-cookie';
    import { registerVerifyEmail } from 'stores/index';
    import { onMount } from 'svelte';
    import {
        getRequestError,
        isRequestErrored,
        sendPostRequest,
    } from 'utilities/main';

    let code = '';
    let identifier = '';
    let errorMessage: string;

    let processing = false;
    let mountReady = false;

    onMount(() => {
        mountReady = true;
    });

    async function verify() {
        if (!code || !identifier) return;

        processing = true;

        const res = await sendPostRequest(
            'register/verify',
            {
                profileId: identifier.toLowerCase(),
                email: $registerVerifyEmail,
                code,
            },
            true
        );

        if (isRequestErrored(res)) {
            errorMessage = getRequestError(res);

            processing = false;
        } else {
            Cookies.set('refreshToken', `Bearer ${res.refreshToken}`, {
                expires: 7,
            });

            Cookies.set('accessToken', `Bearer ${res.accessToken}`, {
                expires: new Date(new Date().getTime() + 60 * 60 * 1000),
            });

            goto('/app', {
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
            <CardTitle>Register verification</CardTitle>
            <CardDescription
                >Finish your new Fronvo account setup</CardDescription
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
                <Label for="password">Account handle</Label>

                <div class="flex items-center">
                    <h1 class="text-xl mr-1">@</h1>
                    <Input
                        bind:value={identifier}
                        maxlength={20}
                        disabled={processing}
                    />
                </div>
            </div>
        </CardContent>
        <CardFooter>
            <Button
                disabled={code.length !== 6 ||
                    identifier.length < 5 ||
                    processing}
                on:click={verify}>Finish setup</Button
            >
        </CardFooter>
    </Card>
{/if}
