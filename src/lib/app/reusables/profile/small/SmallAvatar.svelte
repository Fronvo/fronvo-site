<script lang="ts">
    import { FronvoAccount } from 'interfaces/all';
    import { cachedAccountData } from 'stores/main';
    import { targetProfileModal, viewingProfile } from 'stores/modals';
    import { currentRoomData } from 'stores/rooms';
    import { onDestroy, onMount } from 'svelte';
    import { Unsubscriber } from 'svelte/motion';
    import { findCachedAccount } from 'utilities/main';
    import Indicator from '../../all/Indicator.svelte';

    export let profileId: string;
    export let avatar: string;
    export let status: string;

    let accountCached: FronvoAccount;
    let onlineP = false;

    let unsubscriber: Unsubscriber;

    async function viewProfile(): Promise<void> {
        // Deleted user
        if (!$currentRoomData.dmUser.id) return;

        $targetProfileModal = await findCachedAccount(
            profileId,
            $cachedAccountData
        );

        $viewingProfile = true;
    }

    async function refreshOnlineStatus(targetId?: string) {
        accountCached = await findCachedAccount(
            targetId || profileId,
            $cachedAccountData
        );

        onlineP = accountCached?.online;
    }

    onMount(async () => {
        accountCached = await findCachedAccount(profileId, $cachedAccountData);

        onlineP = accountCached?.online;

        // socket.on('onlineStatusUpdated', async ({ profileId, online }) => {
        //     if (accountCached.profileId == profileId) {
        //         onlineP = online;
        //     }
        // });
    });

    unsubscriber = currentRoomData.subscribe((state) => {
        if (!state) return;

        refreshOnlineStatus(state?.dmUser.id);
    });

    onDestroy(() => {
        if (unsubscriber) unsubscriber();
    });
</script>

<div class={`pb-8 flex translate-x-[-35px] w-full`}>
    <img
        on:click={viewProfile}
        on:keydown={viewProfile}
        src={avatar ? `${avatar}/tr:w-128:h-128` : `/images/avatar.svg`}
        draggable={false}
        class={`${
            !avatar ? 'bg-primary border-accent border-[1px] p-[6px]' : ''
        } fixed border-[1px] cursor-pointer hover:opacity-75 translate-x-[30px] duration-100 translate-y-[-44px] min-w-[70px] w-[70px] h-[70px] rounded-full flex self-start ml-5 select-none`}
        alt="Avatar"
    />

    {#if profileId}
        <Indicator
            online={onlineP}
            fixed
            translateX={97}
            translateY={4}
            width={24}
            height={24}
            borderWidth={4}
        />
    {/if}

    {#if onlineP && status}
        <h1
            class="fixed text-xs bg-accent p-2.5 max-w-[150px] max-h-[70px] text-ellipsis translate-x-[125px] translate-y overflow-hidden flex rounded-2xl rounded-tl-none font-semibold"
        >
            {status}
        </h1>
    {/if}
</div>
