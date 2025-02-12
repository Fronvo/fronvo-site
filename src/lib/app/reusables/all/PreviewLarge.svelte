<script lang="ts">
    import type { FronvoAccount } from 'interfaces/all';
    import LargeBanner from '../profile/large/LargeBanner.svelte';
    import LargeAvatar from '../profile/large/LargeAvatar.svelte';
    import LargeIdentifier from '../profile/large/LargeIdentifier.svelte';
    import LargeBio from '../profile/large/LargeBio.svelte';
    import LargeSince from '../profile/large/LargeSince.svelte';
    import { ourData } from 'stores/profile';
    import LargeConnections from '../profile/large/LargeConnections.svelte';
    import { targetProfileModal } from 'stores/modals';
    import LargeListening from '../profile/large/LargeListening.svelte';

    export let profileData: FronvoAccount;
    export let editable = false;

    let username = $targetProfileModal.username || $ourData.username;
    let bio = $targetProfileModal.id ? $targetProfileModal.bio : $ourData.bio;

    async function uploadData(): Promise<void> {
        return new Promise((resolve) => {
            const updatedData = {};

            if ($ourData.username != username && username.trim().length > 0) {
                updatedData['username'] = username.trim();
            }

            if ($ourData.bio != bio) {
                updatedData['bio'] = bio.replaceAll('\n\n', '').trim();
            }

            if (Object.keys(updatedData).length === 0) {
                resolve();
                return;
            }

            // socket.emit('updateProfileData', updatedData, async ({ err }) => {
            //     if (err) {
            //         resolve();

            //         return;
            //     }

            //     $ourData = {
            //         ...$ourData,
            //         ...updatedData,
            //     };

            //     resolve();
            // });
        });
    }

    function revertData(): void {
        profileData = $ourData;
        username = $ourData.username;
        bio = $ourData.bio;
    }
</script>

<LargeBanner />
<LargeAvatar
    avatar={profileData?.avatar}
    online={profileData.online}
    isSelf={$ourData.id === profileData.id}
    isFriend={$ourData.friends.includes(profileData.id)}
    bind:editable
    editableCallback={uploadData}
    editableRevertCallback={revertData}
/>

<div class="rounded-md mb-1">
    <LargeIdentifier profileId={profileData?.id} bind:username {editable} />

    {#if profileData.currentTrack}
        <div
            class="bg-secondary/20 p-4 pt-3 pb-3 rounded-md border-accent border-[1px] mb-3"
        >
            <LargeListening track={profileData.currentTrack} />
        </div>
    {/if}

    <div class="bg-secondary/20 p-4 rounded-md border-accent border-[1px]">
        {#if profileData?.bio || editable}
            <LargeBio bind:bio {editable} />

            <div class="mb-4" />
        {/if}

        <LargeSince since={profileData?.created_at} />
    </div>

    {#if profileData.hasSpotify || profileData.hasGithub || editable}
        <div
            class="bg-secondary/20 p-4 pt-3 pb-3 rounded-md border-accent border-[1px] mt-3"
        >
            <LargeConnections
                spotify={{
                    hasSpotify: profileData.hasSpotify,
                    spotifyName: profileData.spotifyName,
                    spotifyUrl: profileData.spotifyURL,
                }}
                github={{
                    hasGithub: profileData.hasGithub,
                    githubName: profileData.githubName,
                    githubUrl: profileData.githubURL,
                }}
                {editable}
            />
        </div>
    {/if}
</div>
