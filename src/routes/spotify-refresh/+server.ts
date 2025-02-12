import queryString from 'querystring';
import { json } from '@sveltejs/kit';
import { SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';

/** @type {import('./$types').PageLoad} */
export async function POST({ url }) {
    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',

        body: queryString.stringify({
            grant_type: 'refresh_token',
            refresh_token: url.searchParams.get('refresh_token') || null,
        }),

        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(
                `${PUBLIC_SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
            )}`,
        },
    });

    const jsonRes = JSON.parse(await res.text());

    if (!res.ok) {
        return;
    }

    return json({
        access_token: jsonRes.access_token,
        token_type: jsonRes.token_type,
    });
}
