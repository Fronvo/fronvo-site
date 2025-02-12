<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import Cookies from 'js-cookie';
    import { indexVisible } from 'stores/index';
    import { cachedAccountData, loginSucceeded, showLayout } from 'stores/main';
    import {
        mobileShowMembers,
        pendingChannelId,
        pendingServerId,
    } from 'stores/rooms';
    import { onMount } from 'svelte';
    import { redirectApp } from 'utilities/index';
    import { performLogin } from 'utilities/main';

    onMount(async () => {
        if ($loginSucceeded) {
            $mobileShowMembers = false;

            return;
        }

        // Remove homepage for registered users
        if (Cookies.get('refreshToken')) {
            redirectApp();

            $pendingServerId = $page.params.serverId;
            $pendingChannelId = $page.params.channelId;

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
