// ******************** //
// Shared variables for the app profile panel, after login.
// ******************** //

import type { OurAccount } from 'interfaces/all';
import { writable, type Writable } from 'svelte/store';

/****************************** Our data ******************************/
export const ourData: Writable<OurAccount> = writable();
/****************************** Our data ******************************/
