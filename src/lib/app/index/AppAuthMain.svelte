<script lang="ts">
    import { page } from '$app/stores';
    import {
        indexVisible,
        promotedToRVerify,
        promotedToVerify,
        registerVerifyEmail,
        resetVerifyEmail,
    } from 'stores/index';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import CardContent from '$lib/components/ui/card/card-content.svelte';
    import CardFooter from '$lib/components/ui/card/card-footer.svelte';
    import Card from '$lib/components/ui/card/card.svelte';
    import TabsContent from '$lib/components/ui/tabs/tabs-content.svelte';
    import { Tabs } from '$lib/components/ui/tabs';
    import TabsList from '$lib/components/ui/tabs/tabs-list.svelte';
    import TabsTrigger from '$lib/components/ui/tabs/tabs-trigger.svelte';
    import CardHeader from '$lib/components/ui/card/card-header.svelte';
    import CardTitle from '$lib/components/ui/card/card-title.svelte';
    import CardDescription from '$lib/components/ui/card/card-description.svelte';
    import Label from '$lib/components/ui/label/label.svelte';
    import Input from '$lib/components/ui/input/input.svelte';
    import {
        getRequestError,
        isRequestErrored,
        sendPostRequest,
        setTitle,
    } from 'utilities/main';
    import {
        Dialog,
        DialogClose,
        DialogContent,
        DialogDescription,
        DialogTitle,
    } from '$lib/components/ui/dialog';
    import Cookies from 'js-cookie';

    const isLogin = $page.url.searchParams.get('for') === 'login';

    let error = '';
    let username = '';
    let email = '';
    let password = '';

    let resetting = false;
    let resetError = '';
    let resetEmail = '';

    let disabled = false;

    async function register() {
        // Data validation
        if (!username || !email || !password) return;

        if (password.length < 8) {
            error = 'Password must contain atleast 8 characters';

            return;
        }

        disabled = true;

        const res = await sendPostRequest(
            'register',
            {
                username,
                email,
                password,
            },
            true
        );

        if (isRequestErrored(res)) {
            error = getRequestError(res);

            disabled = false;
        } else {
            $registerVerifyEmail = email;
            $promotedToVerify = true;

            goto('/verify', {
                replaceState: true,
            });
        }
    }

    async function login() {
        // Data validation
        if (!email || !password) return;

        if (password.length < 8) {
            error = 'Password must contain atleast 8 characters';

            return;
        }

        disabled = true;

        const res = await sendPostRequest('login', { email, password }, true);

        if (isRequestErrored(res)) {
            error = getRequestError(res);

            disabled = false;
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

    async function reset() {
        if (!resetEmail) return;

        disabled = true;

        const res = await sendPostRequest('reset', { email: resetEmail }, true);

        if (isRequestErrored(res)) {
            resetError = getRequestError(res);

            disabled = false;
        } else {
            $resetVerifyEmail = resetEmail;
            $promotedToRVerify = true;

            goto('/rverify', {
                replaceState: true,
            });
        }
    }

    onMount(() => {
        if (Cookies.get('refreshToken')) {
            goto('/app', {
                replaceState: true,
            });
        }

        if ($page.url.searchParams.get('for') === 'login') {
            setTitle('Login');
        } else {
            setTitle('Register');
        }
    });

    let value: 'register' | 'login' = isLogin ? 'login' : 'register';

    $: if (value === 'register') {
        setTitle('Register');

        goto('/auth');
        error = '';
    } else {
        setTitle('Login');

        goto('/auth?for=login');
        error = '';
    }
</script>

{#if $indexVisible}
    <Tabs
        bind:value
        class="xs:w-[300px] fixed top-0 right-0 left-0 bottom-0 m-auto w-[400px] h-max"
    >
        <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger {disabled} value="register">Register</TabsTrigger>
            <TabsTrigger {disabled} value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="register">
            <Card>
                <CardHeader>
                    <CardTitle>Register on Fronvo</CardTitle>
                    <CardDescription>
                        Your private social media is one step away
                    </CardDescription>
                </CardHeader>
                <CardContent class="space-y-2">
                    <div class="space-y-1">
                        {#if error}
                            <h1
                                class="text-destructive font-semibold mb-4 text-sm"
                            >
                                {error}
                            </h1>
                        {/if}

                        <Label for="username">Username</Label>
                        <Input bind:value={username} id="username" {disabled} />
                    </div>

                    <div class="space-y-1">
                        <Label for="email">Email</Label>
                        <Input
                            bind:value={email}
                            id="email"
                            type="email"
                            {disabled}
                        />
                    </div>
                    <div class="space-y-1">
                        <Label for="password">Password</Label>
                        <Input
                            bind:value={password}
                            type="password"
                            id="password"
                            {disabled}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button {disabled} on:click={register}>Join Fronvo</Button>
                </CardFooter>
            </Card>
        </TabsContent>
        <TabsContent value="login">
            <Card>
                <CardHeader>
                    <CardTitle>Login to Fronvo</CardTitle>
                    <CardDescription>Regain your online privacy</CardDescription
                    >
                </CardHeader>
                <CardContent class="space-y-2">
                    <div class="space-y-1">
                        {#if error}
                            <h1
                                class="text-destructive font-semibold mb-4 text-sm"
                            >
                                {error}
                            </h1>
                        {/if}

                        <Label for="email">Email</Label>
                        <Input
                            bind:value={email}
                            type="email"
                            id="email"
                            {disabled}
                        />
                    </div>
                    <div class="space-y-1">
                        <Label for="password">Password</Label>
                        <Input
                            bind:value={password}
                            type="password"
                            id="password"
                            {disabled}
                        />

                        <Button
                            on:click={() => {
                                resetting = true;
                            }}
                            {disabled}
                            variant={'link'}
                            class="m-0 p-0"
                        >
                            Reset password
                        </Button>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button {disabled} on:click={login}>Login to Fronvo</Button>
                </CardFooter>
            </Card>
        </TabsContent>
    </Tabs>
{/if}

<Dialog bind:open={resetting} onOpenChange={(e) => (resetting = e)}>
    <DialogContent>
        <DialogTitle>Reset password</DialogTitle>
        <DialogDescription>Reset your Fronvo account password</DialogDescription
        >

        {#if resetError}
            <h1 class="text-destructive font-semibold mb-1 text-sm">
                {resetError}
            </h1>
        {/if}

        <Input
            bind:value={resetEmail}
            placeholder="Email"
            type="email"
            id="email"
        />

        <div class="flex">
            <DialogClose><Button variant="outline">Close</Button></DialogClose>

            <span class="flex-1" />

            <Button
                disabled={resetEmail.length === 0 || disabled}
                on:click={reset}>Send email</Button
            >
        </div>
    </DialogContent>
</Dialog>
