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

        const res = await fetch('/api/spotify', {
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
        class="w-[128px] h-[128px]"
        xmlns="http://www.w3.org/2000/svg"
        width="128"
        height="128"
        viewBox="0 0 32 32"
        ><path
            fill="white"
            d="M16 0C7.197 0 0 7.197 0 16s7.197 16 16 16s16-7.197 16-16S24.88 0 16 0m7.36 23.12c-.319.479-.881.64-1.36.317c-3.76-2.317-8.479-2.797-14.083-1.52c-.557.165-1.037-.235-1.199-.72c-.156-.557.24-1.036.719-1.197c6.084-1.36 11.365-.803 15.521 1.76c.563.24.64.88.401 1.36zm1.921-4.401c-.401.563-1.12.803-1.683.401c-4.317-2.641-10.88-3.437-15.916-1.839c-.641.156-1.365-.161-1.521-.803c-.161-.64.156-1.359.797-1.52c5.844-1.761 13.041-.876 18 2.161c.484.24.724 1.041.323 1.599zm.162-4.479c-5.125-3.043-13.683-3.36-18.563-1.839c-.801.239-1.599-.24-1.839-.964c-.239-.797.24-1.599.959-1.839c5.683-1.681 15.041-1.359 20.964 2.161c.719.401.957 1.36.557 2.079c-.401.563-1.36.801-2.079.401z"
        /></svg
    >

    <h1 class="text-xl text-white mt-5">
        {#if authenticated}
            Successfully linked your Spotify account.
        {:else if errored}
            An error has occured.
        {:else}
            Authenticating your Spotify account...
        {/if}
    </h1>
</div>
