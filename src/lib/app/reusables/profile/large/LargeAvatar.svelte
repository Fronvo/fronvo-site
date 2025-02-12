<script lang="ts">
    import { goto } from '$app/navigation';
    import Button from '$lib/components/ui/button/button.svelte';
    import {
        Dialog,
        DialogClose,
        DialogTitle,
        DialogDescription,
        DialogContent,
    } from '$lib/components/ui/dialog';
    import type { Room } from 'interfaces/all';
    import { disconnected, isMobile } from 'stores/main';
    import { targetProfileModal, viewingProfile } from 'stores/modals';
    import { ourData } from 'stores/profile';
    import {
        currentChannel,
        currentRoomData,
        currentRoomId,
        currentRoomLoaded,
        currentRoomMessages,
        currentServer,
        dmsList,
        isInServer,
        mobileShowMembers,
    } from 'stores/rooms';
    import { onMount } from 'svelte';
    import { toast } from 'svelte-sonner';
    import {
        isAcceptedImage,
        setTitle,
        updateSavedAccount,
    } from 'utilities/main';
    import { uploadImage } from 'utilities/rooms';
    import Indicator from '../../all/Indicator.svelte';
    import Cookies from 'js-cookie';

    export let avatar: string;
    export let online: boolean;
    export let isSelf: boolean;
    export let isFriend: boolean;
    export let editable = false;
    export let editableCallback: () => Promise<void> = async () => {};
    export let editableRevertCallback: () => void = () => {};

    let pending = false;
    let processing = false;

    let removingFriend = false;

    let indicator: HTMLDivElement;

    let uploading = false;

    function changeAvatar(): void {
        if (uploading) return;

        let input = document.createElement('input');
        input.type = 'file';

        input.onchange = async (_) => {
            let file = Array.from(input.files)[0];

            if (file.size > 10000000) {
                toast(`Image is above 10MB.`);
                return;
            }

            if (isAcceptedImage(file.type)) {
                const reader = new FileReader();

                reader.addEventListener('load', async () => {
                    uploading = true;

                    const newIcon = await uploadImage(reader.result);

                    // socket.emit('updateProfileData', {
                    //     avatar: newIcon,
                    // });

                    updateSavedAccount(
                        newIcon,
                        $ourData.id,
                        Cookies.get('refreshToken')
                    );

                    $ourData.avatar = newIcon;

                    uploading = false;
                });

                reader.readAsDataURL(file);
            }
        };

        input.click();
    }

    function closeModal() {
        $viewingProfile = false;
    }

    async function attemptEnterRoom(): Promise<void> {
        for (const dmIndex in $dmsList) {
            const dm = $dmsList[dmIndex] as Room;

            if (dm.dmUser.id != $targetProfileModal.id) continue;

            if ($currentRoomData?.roomId == dm.roomId) return;

            dm.unreadCount = 0;

            $currentRoomData = dm;
            $currentRoomLoaded = false;
            $currentRoomLoaded = true;
            $currentRoomMessages = [];
            $currentRoomId = dm.roomId;

            $currentChannel = undefined;
            $currentServer = undefined;
            $isInServer = false;
            $mobileShowMembers = false;

            setTitle(`@${dm.dmUser.id}`);
            goto(`/@${dm.dmUser.id}`);

            closeModal();
        }
    }

    function messageFriend(): void {
        if ($currentRoomData?.dmUser.id == $targetProfileModal.id) {
            return;
        }

        attemptEnterRoom();

        // socket.emit(
        //     'createDM',
        //     {
        //         profileId: $targetProfileModal.profileId,
        //     },
        //     attemptEnterRoom,
        // );
    }

    function addFriend(): void {
        if (pending) return;

        // socket.emit('addFriend', {
        //     profileId: $targetProfileModal.profileId,
        // });

        pending = true;
    }

    function acceptFriend(): void {
        if (processing) return;

        processing = true;

        // socket.emit(
        //     'acceptFriendRequest',
        //     {
        //         profileId: $targetProfileModal.profileId,
        //     },
        //     () => {
        //         processing = false;
        //     },
        // );
    }

    function rejectFriend(): void {
        if (processing) return;

        processing = true;

        // socket.emit(
        //     'rejectFriendRequest',
        //     {
        //         profileId: $targetProfileModal.profileId,
        //     },
        //     () => {
        //         processing = false;
        //     },
        // );
    }

    function removeFriend(): void {
        processing = true;

        // socket.emit(
        //     'removeFriend',
        //     { profileId: $targetProfileModal.profileId },
        //     () => {
        //         processing = false;
        //     },
        // );
    }

    function updateIndicator(): void {
        setTimeout(() => {
            if (!indicator) return;

            if (online) {
                indicator.style.background = 'rgb(56, 212, 42)';
                indicator.style.visibility = 'visible';
            } else {
                indicator.style.visibility = 'hidden';
            }
        }, 0);
    }

    function editProfile(): void {
        editable = true;
    }

    function closeEditing(): void {
        editable = false;
    }

    function revertEdits(): void {
        if (editableRevertCallback) editableRevertCallback();

        closeEditing();
    }

    async function saveEdits(): Promise<void> {
        if (editableCallback) {
            processing = true;

            await editableCallback();

            processing = false;
        }

        closeEditing();
    }

    onMount(() => {
        updateIndicator();

        pending = false;
    });
</script>

<div class={`flex translate-y-20 ${$isMobile ? 'mobile' : ''}`}>
    <div
        class={`${
            !avatar && 'bg-primary border-accent border-[1px] p-[3px]'
        } rounded-full w-[128px] h-[128px] -translate-y-[80px] -translate-x-[20px] select-none ml-[20px]`}
    >
        <img
            src={avatar ? avatar : '/images/avatar.svg'}
            alt={`Avatar`}
            draggable={false}
            on:click={!processing && editable && changeAvatar}
            class:cursor-pointer={editable}
            class:hover:opacity-50={editable}
            class:duration-200={editable}
            class="w-[128px] h-[128px] rounded-full"
        />
    </div>

    <Indicator {online} size="lg" translateX={-54} translateY={10} />

    <span class="flex-1" />

    {#if $targetProfileModal.id && !editable}
        <div class="flex pt-2 pr-2 select-none">
            {#if isSelf}
                <Button
                    disabled={$disconnected}
                    size="sm"
                    on:click={editProfile}>Edit profile</Button
                >
            {:else if isFriend}
                {#if $currentRoomData?.dmUser.id != $targetProfileModal.id}
                    <Button
                        disabled={processing || $disconnected}
                        variant="outline"
                        size="sm"
                        on:click={messageFriend}
                        >{$isMobile ? 'Message' : 'Send message'}</Button
                    >
                {/if}

                <Button
                    on:click={() => {
                        removingFriend = true;
                    }}
                    variant="destructive"
                    size="sm"
                    disabled={processing || $disconnected}
                    class="ml-2">Remove friend</Button
                >
            {:else if $ourData.pending_friend_requests.includes($targetProfileModal.id)}
                <Button
                    size="sm"
                    disabled={processing || $disconnected}
                    class="mr-2"
                    on:click={acceptFriend}>Accept friend request</Button
                >

                <Button
                    size="sm"
                    disabled={processing || $disconnected}
                    variant="outline"
                    on:click={rejectFriend}>Reject request</Button
                >
            {:else}
                <Button
                    size="sm"
                    id={`${pending ? 'pending' : ''}`}
                    on:click={addFriend}
                    disabled={pending || processing || $disconnected}
                    >{pending
                        ? 'Friend request pending'
                        : 'Send friend request'}</Button
                >
            {/if}
        </div>
    {:else if editable}
        <div class="flex pt-2 pr-2 select-none">
            <Button
                size="sm"
                class="mr-2"
                disabled={processing || $disconnected}
                on:click={saveEdits}>Save changes</Button
            >
            <Button
                size="sm"
                variant="outline"
                disabled={processing}
                on:click={revertEdits}>Discard changes</Button
            >
        </div>
    {/if}
</div>

<Dialog open={removingFriend} onOpenChange={(e) => (removingFriend = e)}>
    <DialogContent>
        <DialogTitle>Remove friend</DialogTitle>
        <DialogDescription
            >Are you sure you want to remove <b>{$targetProfileModal.id}</b> from
            your friends?</DialogDescription
        >

        <div class="flex w-full justify-end">
            <DialogClose class="mr-2"
                ><Button variant="outline">Cancel</Button></DialogClose
            >

            <DialogClose>
                <Button on:click={removeFriend} variant="destructive"
                    >Remove friend</Button
                >
            </DialogClose>
        </div>
    </DialogContent>
</Dialog>
