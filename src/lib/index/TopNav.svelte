<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import ThemeToggle from '$lib/components/ThemeToggle.svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import Separator from '$lib/components/ui/separator/separator.svelte';
    import { Sheet, SheetTrigger } from '$lib/components/ui/sheet';
    import SheetContent from '$lib/components/ui/sheet/sheet-content.svelte';
    import SheetDescription from '$lib/components/ui/sheet/sheet-description.svelte';
    import SheetHeader from '$lib/components/ui/sheet/sheet-header.svelte';
    import SheetTitle from '$lib/components/ui/sheet/sheet-title.svelte';
    import { GithubLogo, HamburgerMenu } from 'radix-icons-svelte';
    import { loginSucceeded } from 'stores/main';
    import { checkHasJWT } from 'utilities/main';

    interface TopNavHeader {
        title: string;
        ref: string;
    }

    const headers: TopNavHeader[] = [];

    export let notFixed = false;
    export let forceShowSheet = false;

    $: isHomepage = $page.url.pathname === '/';

    let hasJWT = checkHasJWT();

    function scrollTop() {
        window.scrollTo({
            top: 0,
        });
    }

    function handleHome() {
        goto('/home');
    }
</script>

<div
    class={`${
        !notFixed ? 'fixed top-0 right-0 left-0' : ''
    } mobile:w-[100%] bg-background/70 backdrop-blur-md m-auto w-screen pr-0 pl-0 h-[64px] max-h-[64px] p-4 select-none z-10`}
>
    <div
        class="mobile:pl-4 mobile:pr-6 flex items-center pl-[15%] pr-[15%] mb-3"
    >
        {#if isHomepage || forceShowSheet}
            <Sheet>
                <SheetTrigger>
                    <Button
                        variant="outline"
                        size="icon"
                        class="xs:inline-flex hidden mr-3 min-w-[36px]"
                    >
                        <HamburgerMenu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" class="min-w-[250px] w-[40%]">
                    <SheetHeader>
                        <SheetTitle asChild>
                            <div class="flex items-center">
                                {#if !$loginSucceeded}
                                    <a href="https://stamtsag.com">
                                        <img
                                            src="/images/stamtsag.ico"
                                            class="w-[28px] h-[28px] mr-2 cursor-pointer"
                                            alt="StamTsag icon"
                                        />
                                    </a>

                                    <h1 class="font-black text-3xl mr-2">/</h1>
                                {/if}

                                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                                <img
                                    on:click={scrollTop}
                                    on:keydown={scrollTop}
                                    src="/fronvo.svg"
                                    class="w-[28px] h-[28px] mr-2 cursor-pointer"
                                    alt="Logo"
                                />

                                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                                <h1
                                    on:click={scrollTop}
                                    on:keydown={scrollTop}
                                    class="xs:text-lg tracking-tighter font-bold text-xl mr-6 translate-x-[-3px] font-black cursor-pointer"
                                >
                                    Fronvo
                                </h1>
                            </div>
                        </SheetTitle>
                        <SheetDescription>
                            <div class="flex flex-col ml-1">
                                {#if !$loginSucceeded}
                                    {#each headers as { title, ref }}
                                        <div class="flex mt-2 mb-2">
                                            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                                            <h1
                                                on:click={() => {
                                                    document
                                                        .querySelector(
                                                            `#${ref}`
                                                        )
                                                        ?.scrollIntoView({
                                                            block: 'start',
                                                        });
                                                }}
                                                on:keydown={() => {
                                                    document
                                                        .querySelector(
                                                            `#${ref}`
                                                        )
                                                        ?.scrollIntoView({
                                                            block: 'start',
                                                        });
                                                }}
                                                class="hover:opacity-[100%] tracking-thin font-medium opacity-[60%] text-sm w-max cursor-pointer transition-[150ms]"
                                            >
                                                {title}
                                            </h1>
                                        </div>
                                    {/each}

                                    <span class="mt-6" />

                                    {#if !hasJWT}
                                        <a href="/auth/login" class="w-[100%]">
                                            <Button
                                                class="mb-4 w-full"
                                                variant={'outline'}
                                            >
                                                Login
                                            </Button>
                                        </a>
                                    {/if}

                                    <a
                                        href={`${hasJWT ? '/home' : '/auth'}`}
                                        class="w-[100%]"
                                    >
                                        <Button class="w-full">
                                            {hasJWT ? 'Home' : 'Register'}
                                        </Button>
                                    </a>
                                {:else}
                                    <div
                                        class="flex flex-col items-center min-w-[200px] w-[200px] pt-4"
                                    />
                                {/if}
                            </div>
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        {/if}

        {#if isHomepage}
            <a href="https://stamtsag.com">
                <img
                    src="/images/stamtsag.ico"
                    class="xs:hidden w-[28px] h-[28px] mr-2 cursor-pointer"
                    alt="StamTsag Logo"
                />
            </a>

            <h1 class="xs:hidden font-black text-3xl mr-2">/</h1>

            <a href="/" class="no-underline flex">
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <img
                    on:click={scrollTop}
                    on:keydown={scrollTop}
                    src="/fronvo.svg"
                    class="xs:hidden w-[28px] h-[28px] mr-2 cursor-pointer"
                    alt="Logo"
                />

                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <h1
                    on:click={!$loginSucceeded ? scrollTop : handleHome}
                    on:keydown={!$loginSucceeded ? scrollTop : handleHome}
                    class="xs:text-lg tracking-tighter font-bold text-xl mr-6 translate-x-[-3px] font-black cursor-pointer"
                >
                    Fronvo
                </h1>
            </a>
        {:else}
            <a
                href={`${!$loginSucceeded ? '/' : '/home'}`}
                class="flex items-center no-underline"
                on:click={!$loginSucceeded ? scrollTop : handleHome}
            >
                <img
                    src="/fronvo.svg"
                    class="w-[28px] h-[28px] mr-2 cursor-pointer"
                    alt="Logo"
                />
                <h1
                    class="xs:text-lg tracking-tighter font-bold text-xl mr-6 translate-x-[-3px] font-black cursor-pointer"
                >
                    Fronvo
                </h1>
            </a>
        {/if}

        {#each headers as { title, ref }}
            <div
                on:click={() =>
                    document.querySelector(`#${ref}`)?.scrollIntoView({
                        block: 'start',
                    })}
                on:keydown={() =>
                    document.querySelector(`#${ref}`)?.scrollIntoView({
                        block: 'start',
                    })}
                class="flex items-center mr-6"
                role="button"
                tabindex="-1"
            >
                <h1
                    class="xs:hidden hover:opacity-[100%] tracking-thin font-medium opacity-[60%] text-sm w-max cursor-pointer transition-[150ms]"
                >
                    {title}
                </h1>
            </div>
        {/each}

        <span class="flex-1" />

        <div class="xs:hidden flex">
            {#if isHomepage}
                {#if !hasJWT}
                    <a href="/auth?for=login">
                        <Button variant={'outline'}>Login</Button>
                    </a>
                {/if}

                <a href={`${hasJWT ? '/home' : '/auth'}`} class="ml-4">
                    <Button>{hasJWT ? 'Home' : 'Register'}</Button>
                </a>
            {/if}

            <a
                href="https://github.com/Fronvo"
                target="_blank"
                class="mr-2 ml-10"
            >
                <Button size="icon" variant="ghost">
                    <GithubLogo class="w-[20px] h-[20px]" />
                </Button>
            </a>
        </div>

        <ThemeToggle />
    </div>

    <Separator />
</div>
