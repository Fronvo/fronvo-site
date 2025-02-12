<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';
    import { ArrowTopRight, GithubLogo } from 'radix-icons-svelte';
    import { ourData } from 'stores/profile';
    import queryString from 'querystring';
    import {
        PUBLIC_GITHUB_CLIENT_ID,
        PUBLIC_SPOTIFY_CLIENT_ID,
    } from '$env/static/public';

    export let spotify: {
        hasSpotify: boolean;
        spotifyName: string;
        spotifyUrl: string;
    };

    export let github: {
        hasGithub: boolean;
        githubName: string;
        githubUrl: string;
    };

    export let editable = false;

    function authenticateSpotify(): void {
        const params = queryString.stringify({
            client_id: PUBLIC_SPOTIFY_CLIENT_ID,
            response_type: 'code',
            redirect_uri:
                `http${!location.host.includes('localhost') ? 's' : ''}://` +
                location.host +
                '/spotify',
            scope: 'user-read-currently-playing user-read-playback-position',
        });

        window.open(
            `https://accounts.spotify.com/authorize?${params}`,
            '_blank'
        );
    }

    function authenticateGithub(): void {
        const params = queryString.stringify({
            client_id: PUBLIC_GITHUB_CLIENT_ID,
        });

        window.open(
            `https://github.com/login/oauth/authorize?${params}`,
            '_blank'
        );
    }

    function openSpotify(): void {
        window.open(spotify.spotifyUrl, '_blank');
    }

    function openGithub(): void {
        window.open(github.githubUrl, '_blank');
    }

    function removeSpotify(): void {
        // socket.emit('removeConnectionSpotify');

        $ourData.hasSpotify = false;
        $ourData.spotifyName = '';
        $ourData.spotifyURL = '';

        spotify = {
            hasSpotify: false,
            spotifyName: '',
            spotifyUrl: '',
        };
    }

    function removeGithub(): void {
        // socket.emit('removeConnectionGithub');

        $ourData.hasGithub = false;
        $ourData.githubName = '';
        $ourData.githubURL = '';

        github = {
            hasGithub: false,
            githubName: '',
            githubUrl: '',
        };
    }
</script>

<div class={`flex flex-wrap flex-col`}>
    <h1 class="text-xs font-bold mb-1 select-none">Connections</h1>

    {#if github.hasGithub || editable}
        <div class="flex items-center mb-1 mt-2 h-[28px]">
            <GithubLogo class="w-[24px] h-[24px] mr-2" />

            <h1
                class="text-[0.8rem] whitespace-pre-wrap mr-3"
                class:flex-1={editable}
            >
                {github.githubName || 'Github'}
            </h1>

            {#if editable}
                {#if github.hasGithub}
                    <Button
                        variant="destructive"
                        class="h-[28px] mr-1 text-xs"
                        on:click={removeGithub}
                    >
                        Disconnect
                    </Button>
                {:else}
                    <Button
                        variant="default"
                        class="h-[28px] mr-1 text-xs"
                        on:click={authenticateGithub}
                    >
                        Connect
                    </Button>
                {/if}
            {/if}

            {#if github.hasGithub}
                <Button
                    variant="outline"
                    class="w-[28px] h-[28px] p-1"
                    on:click={openGithub}
                >
                    <ArrowTopRight />
                </Button>
            {/if}
        </div>
    {/if}

    {#if spotify.hasSpotify || editable}
        <div class="flex items-center mb-1 mt-3 h-[28px]">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                class="w-[24px] h-[24px] mr-2"
                ><path
                    fill="#1ED760"
                    d="M128 0C57.308 0 0 57.309 0 128c0 70.696 57.309 128 128 128c70.697 0 128-57.304 128-128C256 57.314 198.697.007 127.998.007zm58.699 184.614c-2.293 3.76-7.215 4.952-10.975 2.644c-30.053-18.357-67.885-22.515-112.44-12.335a7.981 7.981 0 0 1-9.552-6.007a7.968 7.968 0 0 1 6-9.553c48.76-11.14 90.583-6.344 124.323 14.276c3.76 2.308 4.952 7.215 2.644 10.975m15.667-34.853c-2.89 4.695-9.034 6.178-13.726 3.289c-34.406-21.148-86.853-27.273-127.548-14.92c-5.278 1.594-10.852-1.38-12.454-6.649c-1.59-5.278 1.386-10.842 6.655-12.446c46.485-14.106 104.275-7.273 143.787 17.007c4.692 2.89 6.175 9.034 3.286 13.72zm1.345-36.293C162.457 88.964 94.394 86.71 55.007 98.666c-6.325 1.918-13.014-1.653-14.93-7.978c-1.917-6.328 1.65-13.012 7.98-14.935C93.27 62.027 168.434 64.68 215.929 92.876c5.702 3.376 7.566 10.724 4.188 16.405c-3.362 5.69-10.73 7.565-16.4 4.187z"
                /></svg
            >

            <h1
                class="text-[0.8rem] whitespace-pre-wrap mr-3"
                class:flex-1={editable}
            >
                {spotify.spotifyName || 'Spotify'}
            </h1>

            {#if editable}
                {#if spotify.hasSpotify}
                    <Button
                        variant="destructive"
                        class="h-[28px] mr-1 text-xs"
                        on:click={removeSpotify}
                    >
                        Disconnect
                    </Button>
                {:else}
                    <Button
                        variant="default"
                        class="h-[28px] mr-1 text-xs"
                        on:click={authenticateSpotify}
                    >
                        Connect
                    </Button>
                {/if}
            {/if}

            {#if spotify.hasSpotify}
                <Button
                    variant="outline"
                    class="w-[28px] h-[28px] p-1"
                    on:click={openSpotify}
                >
                    <ArrowTopRight />
                </Button>
            {/if}
        </div>
    {/if}
</div>
