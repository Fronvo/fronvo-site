<script lang="ts">
    import { indexVisible, promotedToVerify } from 'stores/index';
    import { onMount } from 'svelte';
    import { cachedAccountData, showLayout } from 'stores/main';
    import { redirectApp } from 'utilities/index';
    import { performLogin } from 'utilities/main';
    import { goto } from '$app/navigation';
    import AppVerifyMain from '$lib/app/index/AppVerifyMain.svelte';
    import Cookies from 'js-cookie';

    let mountReady = false;

    onMount(async () => {
        if (!$promotedToVerify) {
            goto('/', {
                replaceState: true,
            });

            return;
        }

        // Remove for registered users
        if (Cookies.get('refreshToken')) {
            redirectApp();

            goto('/app', {
                replaceState: true,
            });

            await performLogin($cachedAccountData);
            return;
        }

        // Disable __layout in index
        $showLayout = false;

        // Default when accessed
        $indexVisible = true;

        // Show the index page
        mountReady = true;
    });
</script>

{#if mountReady && $indexVisible}
    <AppVerifyMain />
{/if}
