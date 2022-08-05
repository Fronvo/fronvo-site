// ******************** //
// Shared variables for the app route, after login.
// ******************** //

import CreatePostModal from '$lib/app/main/modals/CreatePostModal.svelte';
import EditProfileModal from '$lib/app/main/modals/EditProfileModal.svelte';
import FindProfilesModal from '$lib/app/main/modals/FindProfilesModal.svelte';
import FollowInfoModal from '$lib/app/main/modals/FollowInfoModal.svelte';
import PostModal from '$lib/app/main/modals/PostModal.svelte';
import SettingsModal from '$lib/app/main/modals/SettingsModal.svelte';
import CommunitiesPanel from '$lib/app/main/panels/CommunitiesPanel.svelte';
import HomePanel from '$lib/app/main/panels/HomePanel.svelte';
import MarketplacePanel from '$lib/app/main/panels/MarketplacePanel.svelte';
import ProfilePanel from '$lib/app/main/panels/ProfilePanel.svelte';
import type { HomePost } from 'interfaces/app/home';
import type { AccountPost } from 'interfaces/app/main';
import { writable, type Writable } from 'svelte/store';

export const loginSucceeded = writable(false);

// Panel settings
export const panels = [
    HomePanel,
    ProfilePanel,
    CommunitiesPanel,
    MarketplacePanel,
];

export const currentPanelId = writable(0);

// Modal settings
export const modals = [
    SettingsModal,
    FollowInfoModal,
    EditProfileModal,
    CreatePostModal,
    PostModal,
    FindProfilesModal,
];

// General Modal settings
export const currentModalId = writable(0);
export const modalVisible = writable(false);
export const modalAnimDuration = 200;

// FollowModal
export const followModalInfo: Writable<string[]> = writable();
export const followModalForFollowing: Writable<boolean> = writable();

// PostModal
export const postModalInfo: Writable<AccountPost | HomePost> = writable();
export const postModalForHome: Writable<boolean> = writable();
