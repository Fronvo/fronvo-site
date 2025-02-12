import { IMAGEKIT_PRIVATE_KEY } from '$env/static/private';
import {
    PUBLIC_IMAGEKIT_PUBLIC_KEY,
    PUBLIC_IMAGEKIT_URL_ENDPOINT,
} from '$env/static/public';
import { json } from '@sveltejs/kit';
import Imagekit from 'imagekit';
import { v4 } from 'uuid';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const requestParsed = await request.json();

    const file = requestParsed['file'] as string;
    const width = requestParsed['width'] as number;
    const height = requestParsed['height'] as number;
    const noTransform = requestParsed['noTransform'] as boolean;

    const imagekit = new Imagekit({
        urlEndpoint: PUBLIC_IMAGEKIT_URL_ENDPOINT,
        publicKey: PUBLIC_IMAGEKIT_PUBLIC_KEY,
        privateKey: IMAGEKIT_PRIVATE_KEY,
    });

    const result = await imagekit.upload({
        file,
        fileName: v4(),
    });

    let finalIcon: string;

    if (noTransform) {
        finalIcon = imagekit.url({
            src: result.url,
        });
    } else {
        finalIcon = imagekit.url({
            src: result.url,
            transformation: [
                {
                    width: width ? width : 128,
                    height: height ? height : 128,
                },
            ],
        });
    }

    return json(finalIcon);
}
