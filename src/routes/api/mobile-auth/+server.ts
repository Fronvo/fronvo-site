import { IMAGEKIT_PRIVATE_KEY } from '$env/static/private';
import {
    PUBLIC_IMAGEKIT_PUBLIC_KEY,
    PUBLIC_IMAGEKIT_URL_ENDPOINT,
} from '$env/static/public';
import { json } from '@sveltejs/kit';
import Imagekit from 'imagekit';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    // Turbo for mobile
    // Possibly rethink at the start to prevent overflows
    const imagekit = new Imagekit({
        urlEndpoint: PUBLIC_IMAGEKIT_URL_ENDPOINT,
        publicKey: PUBLIC_IMAGEKIT_PUBLIC_KEY,
        privateKey: IMAGEKIT_PRIVATE_KEY,
    });

    return json(imagekit.getAuthenticationParameters());
}
