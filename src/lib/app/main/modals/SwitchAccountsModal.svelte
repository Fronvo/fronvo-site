<script lang="ts">
    import { addingAccount, switchingAccounts } from 'stores/modals';
    import ProfilePreviewSwitch from '$lib/app/reusables/all/PreviewSwitch.svelte';
    import type { SwitchedAccount } from 'interfaces/all';
    import { getKey } from 'utilities/global';
    import { ourData } from 'stores/profile';
    import {
        Dialog,
        DialogClose,
        DialogContent,
        DialogDescription,
        DialogTitle,
    } from '$lib/components/ui/dialog';
    import Button from '$lib/components/ui/button/button.svelte';
    import Cookies from 'js-cookie';

    let savedAccounts: SwitchedAccount[];

    function addAccount(): void {
        $switchingAccounts = false;

        $addingAccount = true;
    }

    function refreshSavedAccounts(): void {
        savedAccounts = [];

        savedAccounts = JSON.parse(getKey('savedAccounts', '[]'));
    }

    switchingAccounts.subscribe((state) => {
        if (state) {
            refreshSavedAccounts();
        }
    });
</script>

<Dialog
    open={$switchingAccounts}
    onOpenChange={(e) => ($switchingAccounts = e)}
>
    <DialogContent>
        <DialogTitle>Switch accounts</DialogTitle>
        <DialogDescription
            >Easily switch between your saved accounts on Fronvo</DialogDescription
        >
        {#if savedAccounts}
            <div class="flex flex-col gap-y-3">
                {#if savedAccounts.length == 0}
                    <ProfilePreviewSwitch
                        avatar={$ourData.avatar}
                        profileId={$ourData.id}
                        refreshToken={Cookies.get('refreshToken')}
                    />
                {:else}
                    {#each savedAccounts as { avatar, profileId, refreshToken }}
                        <ProfilePreviewSwitch
                            {avatar}
                            {profileId}
                            {refreshToken}
                            removeCallback={refreshSavedAccounts}
                        />
                    {/each}
                {/if}
            </div>
        {/if}

        <div class="flex items-center">
            <DialogClose><Button variant="outline">Close</Button></DialogClose>

            <span class="flex-1" />

            <Button on:click={addAccount}>Add account</Button>
        </div>
    </DialogContent>
</Dialog>
