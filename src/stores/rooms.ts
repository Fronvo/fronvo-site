import type { FetchedMessage } from 'interfaces/all';
import type {
    FronvoAccount,
    RoomMessage,
    Room,
    Server,
    Channel,
} from 'interfaces/all';
import { writable, type Writable } from 'svelte/store';

/****************************** Room ******************************/
export const dmsList: Writable<Room[]> = writable([]);
export const dmsFilter: Writable<string> = writable('');
export const dmsShowProfile: Writable<boolean> = writable(true);
export const mobileShowMembers: Writable<boolean> = writable(false);

export const serversList: Writable<Server[]> = writable([]);
export const isInServer: Writable<boolean> = writable(false);
export const tempCurrentServer: Writable<Server> = writable();
export const currentServer: Writable<Server> = writable();
export const currentChannel: Writable<Channel> = writable();

export const channelFilter: Writable<string> = writable('');

export const currentRoomId: Writable<string> = writable();
export const currentRoomData: Writable<Partial<Room>> = writable();
export const currentRoomMessages: Writable<
    {
        message: RoomMessage;
        profileData: FronvoAccount;
    }[]
> = writable([]);
export const currentRoomLoaded = writable(false);

export const cachedRooms: Writable<{ [roomId: string]: FetchedMessage[] }> =
    writable({});

export let pendingMessages: Writable<string[]> = writable([]);

export const pendingProfileDMId: Writable<string> = writable();
export const pendingServerId: Writable<string> = writable();
export const pendingChannelId: Writable<string> = writable();
/****************************** Room ******************************/

/****************************** Message ******************************/
export const sendContent: Writable<string> = writable('');
export const sendingImage: Writable<boolean> = writable(false);
export const canMessage: Writable<boolean> = writable(false);
/****************************** Message ******************************/

/****************************** Reply ******************************/
export const replyingTo: Writable<string> = writable();
export const replyingToId: Writable<string> = writable();
/****************************** Reply ******************************/
