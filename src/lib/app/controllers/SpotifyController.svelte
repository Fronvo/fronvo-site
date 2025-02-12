<script lang="ts">
    import type SpotifyWebApi from 'spotify-web-api-node';
    import SpotifyAPI from 'spotify-web-api-node';
    import { ourData } from 'stores/profile';
    import { onDestroy, onMount } from 'svelte';

    let api: SpotifyWebApi;

    async function generateNewToken(): Promise<string> {
        const newTokenRes: { access_token: string; token_type: string } =
            await (
                await fetch(
                    `/spotify-refresh?refresh_token=${$ourData.spotifyRefreshToken}`,
                    {
                        method: 'POST',
                        body: JSON.stringify({}),
                    }
                )
            ).json();

        return newTokenRes.access_token;
    }

    async function updateCurrentTrack(): Promise<void> {
        const track = (await api.getMyCurrentPlayingTrack()).body;

        if (track?.is_playing) {
            // @ts-ignore
            if (!track.item?.artists) return;

            // TODO: Manual types cus the types package is half done
            // @ts-ignore
            const artists = track.item.artists.map((v) => {
                return { name: v.name, url: v.external_urls.spotify };
            });

            $ourData.currentTrack = {
                title: track.item.name,
                href: track.item.external_urls.spotify,
                // @ts-ignore
                icon: track.item.album.images[2].url,
                artists,
                duration: track.item.duration_ms,
                progress: track.progress_ms,
            };
        } else {
            $ourData.currentTrack = undefined;
        }
    }

    onMount(async () => {
        api = new SpotifyAPI({
            accessToken: await generateNewToken(),
        });

        // Smooth load
        await updateCurrentTrack();

        const i = setInterval(() => {
            if (!$ourData.hasSpotify) clearInterval(i);
            else updateCurrentTrack();
        }, 1000);

        // Update access token every 0.95 hours
        const i2 = setInterval(async () => {
            if (!$ourData.hasSpotify) clearInterval(i2);
            else
                api = new SpotifyAPI({
                    accessToken: await generateNewToken(),
                });
        }, 3420000);
    });

    onDestroy(() => {
        $ourData.currentTrack = undefined;
    });
</script>
