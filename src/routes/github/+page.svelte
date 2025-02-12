<script lang="ts">
    import { page } from '$app/stores';
    import Cookies from 'js-cookie';
    import { indexVisible } from 'stores/index';
    import { showLayout } from 'stores/main';
    import { onMount } from 'svelte';

    let authenticated = false;
    let errored = false;

    onMount(async () => {
        $showLayout = false;
        $indexVisible = true;

        if (!$page.url.searchParams.get('code')) {
            location.href = '/';
            return;
        }

        const res = await fetch('/api/github', {
            method: 'POST',
            body: JSON.stringify({
                token: Cookies.get('refreshToken'),
                code: $page.url.searchParams.get('code'),
            }),
        });

        if ((await res.json()) == '500') {
            errored = true;
            return;
        }

        authenticated = true;
    });
</script>

<div
    class="flex flex-col items-center justify-center fixed top-0 right-0 left-0 bottom-0 m-auto w-max h-max select-none"
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="256"
        height="256"
        viewBox="0 0 16 16"
        class="w-[128px] h-[128px]"
        ><path
            fill={'white'}
            d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38c0-.27.01-1.13.01-2.2c0-.75-.25-1.23-.54-1.48c1.78-.2 3.65-.88 3.65-3.95c0-.88-.31-1.59-.82-2.15c.08-.2.36-1.02-.08-2.12c0 0-.67-.22-2.2.82c-.64-.18-1.32-.27-2-.27c-.68 0-1.36.09-2 .27c-1.53-1.03-2.2-.82-2.2-.82c-.44 1.1-.16 1.92-.08 2.12c-.51.56-.82 1.28-.82 2.15c0 3.06 1.86 3.75 3.64 3.95c-.23.2-.44.55-.51 1.07c-.46.21-1.61.55-2.33-.66c-.15-.24-.6-.83-1.23-.82c-.67.01-.27.38.01.53c.34.19.73.9.82 1.13c.16.45.68 1.31 2.69.94c0 .67.01 1.3.01 1.49c0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8"
        /></svg
    >

    <h1 class="text-xl text-white mt-5">
        {#if authenticated}
            Successfully linked your Github account.
        {:else if errored}
            An error has occured.
        {:else}
            Authenticating your Github account...
        {/if}
    </h1>
</div>
