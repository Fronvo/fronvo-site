import type { Post } from 'interfaces/all';
import {
    totalDashboardPosts,
    dashboardPosts as dashPosts,
    ourPosts,
    totalOurPosts,
} from 'stores/dashboard';
import { sendRequest } from './main';

export async function loadOurPosts(): Promise<Post[]> {
    const posts = (await sendRequest('me/posts')).posts;

    totalOurPosts.set(posts.length);
    ourPosts.set(posts);

    return posts;
}

export async function loadHomePosts(): Promise<Post[]> {
    const homePosts = (await sendRequest('me/home')).homePosts;

    totalDashboardPosts.set(homePosts.length);
    dashPosts.set(homePosts);

    return homePosts;
}
