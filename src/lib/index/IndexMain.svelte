<script lang="ts">
    import { onMount } from 'svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import { GithubLogo } from 'radix-icons-svelte';
    import { checkHasJWT } from 'utilities/main';

    let mountReady = false;
    let hasJWT = checkHasJWT();

    onMount(() => {
        mountReady = true;
    });
</script>

{#if mountReady}
    <div
        class="xs:h-[90vh] xs:overflow-hidden h-[100vh] w-full flex flex-col items-center justify-center text-center"
    >
        <h1
            class="xs:text-[1.7rem] font-extrabold text-5xl tracking-tighter pb-3"
        >
            Private social media, reimagined.
        </h1>

        <h1 class="xs:text-sm xs:w-[90%] w-[500px] text-lg">
            Imagine a social media world where everything is customisable and
            nothing is tracked. Now you can live in it.
        </h1>

        <div class="flex items-center mt-7">
            <a href={`${hasJWT ? '/app' : '/auth'}`}>
                <Button class="xs:text-sm mr-2 font-semibold text-md" size="lg">
                    {hasJWT ? 'Get back online' : 'Try Fronvo online'}
                </Button>
            </a>

            <a href="https://github.com/Fronvo" target="_blank">
                <Button
                    variant={'outline'}
                    size="lg"
                    class="xs:text-sm ml-2 font-semibold text-md"
                >
                    <GithubLogo class="xs:text-sm mr-2 w-[20px] h-[20px]" />
                    View on Github
                </Button>
            </a>
        </div>
    </div>
{/if}
