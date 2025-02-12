<script lang="ts">
    import type { FronvoAccount } from 'interfaces/all';
    import SmallSince from '../profile/small/SmallSince.svelte';
    import SmallAvatar from '../profile/small/SmallAvatar.svelte';
    import SmallBanner from '../profile/small/SmallBanner.svelte';
    import SmallIdentifier from '../profile/small/SmallIdentifier.svelte';
    import SmallBio from '../profile/small/SmallBio.svelte';
    import Separator from '$lib/components/ui/separator/separator.svelte';

    export let profileData: FronvoAccount;
</script>

<div class="w-full flex flex-col items-center">
    <h1 class="text-xs uppercase font-bold pl-2 pt-1 w-full select-none">
        User Info
    </h1>

    <Separator class="mt-2" />

    <SmallBanner />
    <SmallAvatar
        profileId={profileData.id}
        avatar={profileData?.avatar}
        status={profileData?.status}
    />

    <SmallIdentifier
        profileId={profileData?.id}
        username={profileData?.username}
    />

    {#if profileData?.id}
        <div
            class="w-[90%] bg-secondary/30 rounded-md p-4 mt-3 mb-1 border-accent border-[1px]"
        >
            {#if profileData?.bio}
                <SmallBio bio={profileData?.bio} />

                <div class="mb-3" />
            {/if}

            <SmallSince since={profileData?.created_at} />
        </div>
    {/if}
</div>
