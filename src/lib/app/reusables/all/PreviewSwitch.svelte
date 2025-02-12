<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';
    import {
        Tooltip,
        TooltipContent,
        TooltipTrigger,
    } from '$lib/components/ui/tooltip';
    import Cookies from 'js-cookie';
    import { Trash } from 'radix-icons-svelte';
    import { ourData } from 'stores/profile';
    import { removeSavedAcount } from 'utilities/main';

    export let avatar: string;
    export let profileId: string;
    export let refreshToken: string;
    export let removeCallback: () => void = () => {};

    const isActive = $ourData.id === profileId;

    function login(): void {
        Cookies.set('refreshToken', `Bearer ${refreshToken}`, {
            expires: 7,
        });

        location.href = '/profile';
    }

    function remove(): void {
        removeSavedAcount(profileId);

        removeCallback();
    }
</script>

<div class="w-full flex gap-x-2">
    <Button
        variant="outline"
        class={`${
            isActive
                ? 'bg-accent border-accent cursor-default'
                : 'cursor-pointer'
        } flex items-center w-full justify-start p-6 pl-3 pr-3`}
        on:click={!isActive && login}
    >
        <img
            src={avatar ? `${avatar}/tr:w-72:h-72` : '/images/avatar.svg'}
            alt={`${profileId}'s avatar`}
            draggable={false}
            class={`${
                !avatar && 'bg-primary border-accent border-[1px] p-[3px]'
            } w-[36px] h-[36px] mr-2 rounded-full`}
        />

        <div class="bottom-container">
            <h1 class="text-sm">{profileId}</h1>
        </div>
    </Button>

    {#if !isActive}
        <Tooltip>
            <TooltipTrigger>
                <Button
                    variant="outline"
                    on:click={remove}
                    size="icon"
                    class="m-auto"
                >
                    <Trash />
                </Button>
            </TooltipTrigger>

            <TooltipContent>Delete</TooltipContent>
        </Tooltip>
    {/if}
</div>
