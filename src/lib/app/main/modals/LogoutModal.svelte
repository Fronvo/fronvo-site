<script lang="ts">
    import { loggingOut } from 'stores/modals';
    import {
        Dialog,
        DialogClose,
        DialogContent,
        DialogDescription,
        DialogTitle,
    } from '$lib/components/ui/dialog';
    import { Button } from '$lib/components/ui/button';
    import Cookies from 'js-cookie';

    function logout(): void {
        Cookies.remove('refreshToken');
        Cookies.remove('accessToken');

        localStorage.clear();

        location.href = '/app';
    }
</script>

<Dialog open={$loggingOut} onOpenChange={(e) => ($loggingOut = e)}>
    <DialogContent>
        <DialogTitle>Logout from Fronvo</DialogTitle>
        <DialogDescription
            >Are you sure you want to log out of Fronvo?</DialogDescription
        >

        <div class="flex items-center justify-end">
            <DialogClose
                ><Button variant="outline" class="mr-2">Cancel</Button
                ></DialogClose
            >

            <Button on:click={logout} variant="destructive">Logout</Button>
        </div>
    </DialogContent>
</Dialog>
