import { json } from '@sveltejs/kit';
import { io } from 'socket.io-client';
import { SERVER_URL } from 'stores/main.js';

/** @type {import('./$types').PageLoad} */
export async function POST({ request, url }) {
    const requestParsed = await request.json();

    const token = requestParsed['token'] as string;
    const code = requestParsed['code'] as string;

    if (!code || !token) return json(400);

    // Instead of JSON
    let data = new FormData();
    data.append('client_id', import.meta.env.VITE_GITHUB_CLIENT_ID);
    data.append('client_secret', import.meta.env.VITE_GITHUB_CLIENT_SECRET);
    data.append('code', code);

    const res = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',

        body: data,

        headers: {
            Accept: 'application/json',
        },
    });

    const jsonRes = JSON.parse(await res.text());

    if (!res.ok) {
        return json('500');
    }
    const client = io(SERVER_URL, {
        transports: ['websocket'],
        path: '/fronvo',
    });

    async function connectGithub(): Promise<number> {
        return new Promise((resolve) => {
            client.on('connect', () => {
                client.emit(
                    'loginToken',
                    {
                        token,
                    },
                    async ({ err }) => {
                        if (!err) {
                            // Get account info
                            const info = await (
                                await fetch(`https://api.github.com/user`, {
                                    headers: {
                                        Authorization: `${jsonRes.token_type} ${jsonRes.access_token}`,
                                    },
                                })
                            ).json();
                            client.emit(
                                'updateConnectionGithub',
                                {
                                    secret: import.meta.env.VITE_GENERAL_SECRET,
                                    name: info.name,
                                    url: info.html_url,
                                },
                                ({ err }) => {
                                    client.emit('logout');

                                    if (!err) {
                                        resolve(200);
                                    } else {
                                        resolve(500);
                                    }
                                }
                            );
                        }
                    }
                );
            });
        });
    }

    return json(await connectGithub());
}
