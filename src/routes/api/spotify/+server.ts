import { SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import {
    PUBLIC_FRONVO_API_URL,
    PUBLIC_SPOTIFY_CLIENT_ID,
} from '$env/static/public';
import { json } from '@sveltejs/kit';
import queryString from 'querystring';
import { io } from 'socket.io-client';

/** @type {import('./$types').PageLoad} */
export async function POST({ request, url }) {
    const requestParsed = await request.json();

    const token = requestParsed['token'] as string;
    const code = requestParsed['code'] as string;

    if (!code || !token) return json(400);

    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',

        body: queryString.stringify({
            grant_type: 'authorization_code',
            code,
            redirect_uri:
                `http${!url.host.includes('localhost') ? 's' : ''}://` +
                url.host +
                '/spotify',
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
        return json('500');
    }
    const client = io(PUBLIC_FRONVO_API_URL, {
        transports: ['websocket'],
        path: '/fronvo',
    });

    // async function connectSpotify(): Promise<number> {
    //     return new Promise((resolve) => {
    //         client.on('connect', () => {
    //             client.emit(
    //                 'loginToken',
    //                 {
    //                     token,
    //                 },
    //                 async ({ err }) => {
    //                     if (!err) {
    //                         // Get account info
    //                         const info = await (
    //                             await fetch(`https://api.spotify.com/v1/me`, {
    //                                 headers: {
    //                                     Authorization: `${jsonRes.token_type} ${jsonRes.access_token}`,
    //                                 },
    //                             })
    //                         ).json();
    //                         client.emit(
    //                             'updateConnectionSpotify',
    //                             {
    //                                 secret: GENERAL_SECRET,
    //                                 name: info.display_name,
    //                                 url: info.external_urls.spotify,
    //                                 refreshToken: jsonRes.refresh_token,
    //                                 accessToken: jsonRes.access_token,
    //                                 tokenType: jsonRes.token_type,
    //                             },
    //                             ({ err }) => {
    //                                 client.emit('logout');

    //                                 if (!err) {
    //                                     resolve(200);
    //                                 } else {
    //                                     resolve(500);
    //                                 }
    //                             }
    //                         );
    //                     }
    //                 }
    //             );
    //         });
    //     });
    // }

    // return json(await connectSpotify());
}
