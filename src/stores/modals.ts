import type { FronvoAccount } from 'interfaces/all';
import { writable, type Writable } from 'svelte/store';

/****************************** Modal Exports ******************************/
export const viewingProfile: Writable<boolean> = writable(false);
export const targetProfileModal: Writable<FronvoAccount> = writable();

export const updatingStatus: Writable<boolean> = writable(false);
export const loggingOut: Writable<boolean> = writable(false);
export const switchingAccounts: Writable<boolean> = writable(false);
export const addingAccount: Writable<boolean> = writable(false);
export const requestingData: Writable<boolean> = writable(false);
export const deletingAccount: Writable<boolean> = writable(false);
/****************************** Modal Exports ******************************/
