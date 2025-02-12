import { writable } from 'svelte/store';

export const indexVisible = writable(true);
export const promotedToVerify = writable(false);
export const promotedToRVerify = writable(false);

export const registerVerifyEmail = writable('');
export const resetVerifyEmail = writable('');
