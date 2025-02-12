import type { Post } from 'interfaces/all';
import { writable, type Writable } from 'svelte/store';
import { DashboardFriendTab, DashboardOptions } from 'types/all';

/****************************** Dashboard ******************************/
export const totalDashboardPosts = writable(-1);
export const dashboardPosts: Writable<Post[]> = writable();

export const totalOurPosts = writable(-1);
export const ourPosts: Writable<Post[]> = writable();

export const activeDashboardTab: Writable<DashboardOptions> = writable(
    DashboardOptions.Profile
);

export const activeFriendsTab: Writable<DashboardFriendTab> = writable(
    DashboardFriendTab.Online
);
/****************************** Dashboard ******************************/
