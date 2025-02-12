<script lang="ts">
    import { page } from '$app/stores';
    import Cookies from 'js-cookie';
    import { indexVisible } from 'stores/index';
    import { cachedAccountData, loginSucceeded, showLayout } from 'stores/main';
    import { pendingProfileDMId } from 'stores/rooms';
    import { onMount } from 'svelte';
    import { redirectApp } from 'utilities/index';
    import { performLogin } from 'utilities/main';

    onMount(async () => {
        if ($loginSucceeded) return;

        if (Cookies.get('refreshToken')) {
            redirectApp();

            $pendingProfileDMId = $page.params.profileId;

            await performLogin($cachedAccountData);

            return;
        } else {
            // Disable __layout in index
            $showLayout = false;

            // Default when accessed
            $indexVisible = true;
        }
    });
</script>
