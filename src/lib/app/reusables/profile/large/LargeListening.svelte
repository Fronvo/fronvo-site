<script lang="ts">
    import Progress from '$lib/components/ui/progress/progress.svelte';
    import { SpotifyCurrentTrack } from 'interfaces/all';

    export let track: SpotifyCurrentTrack;
</script>

<h1 class="text-xs font-bold select-none">Listening to Spotify</h1>

<div class="flex mt-1.5 overflow-hidden">
    <img
        src={track.icon}
        alt={`${track.title}\ song icon`}
        class="min-w-[48px] w-[48px] h-[48px] rounded-sm mr-2"
        draggable={false}
    />

    <div class="flex flex-col flex-1">
        <a
            class="no-underline hover:underline w-max"
            href={track.href}
            target="_blank"
            ><h1
                class="text-sm font-semibold max-w-[375px] overflow-hidden text-ellipsis whitespace-pre"
            >
                {track.title}
            </h1></a
        >

        <div class="flex max-w-[375px] overflow-hidden">
            {#each track.artists as { name, url }, i}
                {@const lastArtist = track.artists.length - 1 === i}

                <a
                    class={`${
                        !lastArtist && 'mr-[2px]'
                    } no-underline hover:underline`}
                    href={url}
                    target="_blank"
                >
                    <h1 class="text-xs whitespace-pre">
                        {name}{!lastArtist ? ',' : ''}
                    </h1>
                </a>
            {/each}
        </div>

        <Progress
            class="w-full h-[3px] mt-1.5 rounded-full"
            value={track.progress}
            max={track.duration}
        />
    </div>
</div>
