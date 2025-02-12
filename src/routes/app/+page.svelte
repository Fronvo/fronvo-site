<script lang="ts">
    import { onMount } from 'svelte';
    import { cachedAccountData, showLayout } from 'stores/main';
    import { redirectApp } from 'utilities/index';
    import { performLogin } from 'utilities/main';
    import { goto } from '$app/navigation';
    import Cookies from 'js-cookie';

    onMount(async () => {
        if (Cookies.get('refreshToken')) {
            redirectApp();

            await performLogin($cachedAccountData);
            return;
        }

        // Disable __layout in index
        $showLayout = false;

        // Default when accessed
        goto('/auth');
    });
</script>
