import type { FronvoAccount } from 'interfaces/all';
import { writable, type Writable } from 'svelte/store';

/****************************** Fronvo title ******************************/
export const fronvoTitle = writable('');
/****************************** Fronvo title ******************************/

/****************************** Fronvo mobile ******************************/
export const isMobile = writable(false);
/****************************** Fronvo mobile ******************************/

/****************************** Fronvo layout ******************************/
export const showLayout = writable(false);
/****************************** Fronvo layout ******************************/

/****************************** Fronvo token ******************************/
export const currentToken: Writable<string> = writable();
/****************************** Fronvo layout ******************************/

/****************************** Fronvo dark theme ******************************/
export const darkTheme = writable(undefined);
/****************************** Fronvo dark theme ******************************/

/****************************** Fronvo login state ******************************/
export const loginSucceeded: Writable<boolean> = writable(undefined);
/****************************** Fronvo login state ******************************/

/****************************** Fronvo disconnected ******************************/
export const disconnected: Writable<boolean> = writable(true);
/****************************** Fronvo disconnected ******************************/

/****************************** Fronvo caching ******************************/
export const cachedAccountData: Writable<FronvoAccount[]> = writable([]);
/****************************** Fronvo caching ******************************/
