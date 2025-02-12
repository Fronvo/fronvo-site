<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';
    import type { Server } from 'interfaces/all';
    import { ChevronDown, ChevronUp } from 'radix-icons-svelte';
    import {
        currentChannel,
        currentRoomData,
        currentRoomId,
        currentRoomMessages,
        currentServer,
        isInServer,
        serversList,
    } from 'stores/rooms';
    import { onMount } from 'svelte';
    import { setTitle } from 'utilities/main';

    let mutualServers: Server[] = [];
    let showMutuals = false;

    function findMutualServers(): void {
        mutualServers = [];

        for (const serverIndex in $serversList) {
            const server = $serversList[serverIndex];

            if (
                server.members.filter(
                    (v) => v.id === $currentRoomData.dmUser?.id
                )
            ) {
                mutualServers.push(server);
            }
        }
    }

    function toggleShow(): void {
        showMutuals = !showMutuals;
    }

    function enterMutualServer(index: number): void {
        // See last accessed channel with localStorage key
        $currentChannel = undefined;
        $currentRoomId = undefined;
        $currentRoomData = undefined;

        $isInServer = true;
        $currentServer = mutualServers[index];

        $currentRoomMessages = [];

        setTitle(mutualServers[index].name);
    }

    onMount(() => {
        currentRoomData.subscribe((data) => {
            if (!data) return;

            showMutuals = false;

            findMutualServers();
        });
    });
</script>

{#if mutualServers.length > 0}
    <div class="flex flex-col w-full border-t mt-3 pt-3 select-none">
        <Button
            variant="outline"
            class={`${showMutuals && 'bg-accent border-accent'} w-[90%] ml-3`}
            on:click={toggleShow}
        >
            <h1 class="mr-3 text-xs">
                {mutualServers.length} mutual server{mutualServers.length != 1
                    ? 's'
                    : ''}
            </h1>

            {#if !showMutuals}
                <ChevronDown />
            {:else}
                <ChevronUp />
            {/if}
        </Button>

        {#if showMutuals}
            <div
                class="[&::-webkit-scrollbar]:hidden mt-2 max-h-[190px] pb-0 overflow-y-auto border-accent border-[1px] rounded-lg ml-3 mr-3"
            >
                {#each mutualServers as server, i}
                    <Button
                        variant="ghost"
                        class="w-full hover:bg-accent/50 flex items-center pt-5 pb-5 pl-2 pr-2 justify-start duration-0 rounded-none"
                        on:click={() => enterMutualServer(i)}
                    >
                        {#if server.avatar}
                            <img
                                id="icon"
                                src={`${server.avatar}/tr:w-64:h-64`}
                                alt={`${server.name}\'s icon'`}
                                draggable={false}
                            />
                        {:else}
                            <div
                                class="bg-accent border-accent text-xs mr-2 w-[32px] flex items-center justify-center h-[32px] border-2 rounded-full pr-1.5 pl-1.5 pb-1 pt-1"
                            >
                                <h1>{server.name[0]}{server.name[1] || ''}</h1>
                            </div>
                        {/if}

                        <h1 class="text-xs">
                            {server.name}
                        </h1>
                    </Button>
                {/each}
            </div>
        {/if}
    </div>
{/if}
