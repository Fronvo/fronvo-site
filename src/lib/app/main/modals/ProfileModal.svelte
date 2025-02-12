<script lang="ts">
    import { targetProfileModal, viewingProfile } from 'stores/modals';
    import PreviewLarge from '$lib/app/reusables/all/PreviewLarge.svelte';
    import { Dialog } from '$lib/components/ui/dialog';
    import DialogContent from '$lib/components/ui/dialog/dialog-content.svelte';
    import { ourData } from 'stores/profile';

    ourData.subscribe((state) => {
        if (!state || !$targetProfileModal) return;

        if ($targetProfileModal.id === $ourData.id) {
            $targetProfileModal = $ourData;
        }
    });
</script>

<Dialog open={$viewingProfile} onOpenChange={(e) => ($viewingProfile = e)}>
    <DialogContent>
        <PreviewLarge profileData={$targetProfileModal} />
    </DialogContent>
</Dialog>
