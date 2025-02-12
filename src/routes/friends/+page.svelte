<script lang="ts">
    import { goto } from '$app/navigation';
    import Cookies from 'js-cookie';
    import { activeDashboardTab } from 'stores/dashboard';
    import { indexVisible } from 'stores/index';
    import { cachedAccountData, loginSucceeded, showLayout } from 'stores/main';
    import { onMount } from 'svelte';
    import { DashboardOptions } from 'types/all';
    import { redirectApp } from 'utilities/index';
    import { performLogin } from 'utilities/main';

    onMount(async () => {
        if ($loginSucceeded) {
            return;
        }

        // Remove homepage for registered users
        if (Cookies.get('refreshToken')) {
            redirectApp();

            $activeDashboardTab = DashboardOptions.Friends;

            await performLogin($cachedAccountData);
            return;
        }

        // Disable __layout in index
        $showLayout = false;

        // Default when accessed
        $indexVisible = true;

        goto('/', {
            replaceState: true,
        });
    });
</script>
