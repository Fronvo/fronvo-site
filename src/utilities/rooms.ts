import type {
    FronvoAccount,
    Member,
    Room,
    RoomMessage,
    Server,
} from 'interfaces/all';
import {
    sendContent,
    replyingTo,
    replyingToId,
    currentRoomData,
    currentRoomMessages,
    currentRoomId,
    currentRoomLoaded,
    sendingImage as sendingImageStore,
    dmsList,
    isInServer,
    serversList,
    currentServer,
    currentChannel,
    cachedRooms as cachedRoomsStore,
    pendingMessages as pendingMessagesStore,
} from 'stores/rooms';
import type { FetchedMessage } from 'interfaces/all';
import { sendPostRequest, sendRequest } from './main';

export async function fetchConvos(): Promise<Room[]> {
    return (await sendRequest('me/convos')).convos;
}

export async function fetchServers(): Promise<Server[]> {
    return (await sendRequest('me/servers')).servers;
}

export async function loadRoomsData(): Promise<Room[]> {
    // Load convos data
    const convos = await fetchConvos();

    // Re-init because we can't dynamically update
    dmsList.set(convos);

    return convos;
}

export async function loadServersData(): Promise<Server[]> {
    // Load servers data
    const servers = await fetchServers();

    const tempServerList: Server[] = [];

    for (const serverObj in servers) {
        const server = servers[serverObj];

        tempServerList.push(server);
    }

    // Re-init because we can't dynamically update
    serversList.set(tempServerList);

    return servers;
}

export function sendMessage(
    roomId: string,
    content: string,
    replyingToP: string,
    replyingToIdP: string,
    messages: FetchedMessage[],
    pendingMessages: string[],
    ourData: FronvoAccount,
    serverId?: string
): void {
    if (content.trim().length == 0) return;

    if (!serverId) {
        // socket.emit('sendMessage', {
        //     roomId,
        //     message: content,
        //     replyId: replyingToP ? replyingToIdP : '',
        // });
    } else {
        // socket.emit('sendChannelMessage', {
        //     serverId,
        //     channelId: roomId,
        //     message: content,
        //     replyId: replyingToP ? replyingToIdP : '',
        // });

        sendPostRequest('messages/create', {
            id: serverId,
            channelId: roomId,
            content,
            replyId: replyingToP ? replyingToIdP : '',
        });
    }

    // Reset params
    sendContent.set('');
    replyingTo.set(undefined);
    replyingToId.set(undefined);

    messages.push({
        message: {
            id: '',
            profile_id: ourData.id,
            content,
            created_at: new Date().toString(),
            reply_id: replyingToIdP,
            channel_id: roomId,
            server_id: serverId,
            attachments: [],
            edited: false,
            spotify_embed: '',
            tenor_url: '',
        },
        profileData: ourData,
    });

    pendingMessages.push(content);
    pendingMessagesStore.set(pendingMessages);
}

export async function uploadImage(
    file: any,
    width?: number,
    height?: number
): Promise<string> {
    return await (
        await fetch('/api/upload', {
            method: 'POST',
            body: JSON.stringify({
                file,
                noTransform: !width && !height,
                width,
                height,
            }),
        })
    ).json();
}

export async function sendImage(
    roomId: string,
    sendingImage: boolean,
    file: any,
    serverId?: string
): Promise<void> {
    if (sendingImage) return;

    sendingImageStore.set(true);

    const img = new Image();

    img.src = file;

    // return new Promise((resolve) => {
    //     img.onload = async () => {
    //         const dimensions = {
    //             width: img.width,
    //             height: img.height,
    //         };

    //         if (!serverId) {
    //             socket.emit(
    //                 'sendImage',
    //                 {
    //                     roomId,
    //                     attachment: await uploadImage(file),
    //                     ...dimensions,
    //                 },
    //                 () => {
    //                     sendingImageStore.set(false);
    //                 }
    //             );
    //         } else {
    //             socket.emit(
    //                 'sendChannelImage',
    //                 {
    //                     serverId,
    //                     channelId: roomId,
    //                     attachment: await uploadImage(file),
    //                     ...dimensions,
    //                 },
    //                 () => {
    //                     sendingImageStore.set(false);
    //                 }
    //             );
    //         }

    //         resolve();
    //     };
    // });
}

export function goHome(): void {
    currentRoomId.set(undefined);
    currentRoomData.set(undefined);
    currentRoomMessages.set([]);
    currentRoomLoaded.set(false);
    isInServer.set(false);
    currentServer.set(undefined);
    currentChannel.set(undefined);
}

export async function getRoomMessages(
    roomId: string,
    currentMessagesLength: number,
    serverId?: string
): Promise<FetchedMessage[]> {
    if (!serverId) {
        // socket.emit(
        //     'fetchMessages',
        //     {
        //         roomId: roomId,
        //         from: currentMessagesLength.toString(),
        //         to: (currentMessagesLength + 50).toString(),
        //     },
        //     ({ roomMessages }) => {
        //         resolve(roomMessages);
        //         return;
        //     }
        // );
    } else {
        // socket.emit(
        //     'fetchChannelMessages',
        //     {
        //         serverId,
        //         channelId: roomId,
        //         from: currentMessagesLength.toString(),
        //         to: (currentMessagesLength + 50).toString(),
        //     },
        //     ({ channelMessages }) => {
        //         resolve(channelMessages);

        //         return;
        //     }
        // );

        const res = await sendPostRequest('messages/fetch', {
            id: serverId,
            channelId: roomId,
            from: currentMessagesLength,
            to: currentMessagesLength + 50,
        });

        const messages: RoomMessage[] = res.messages;
        const profileData: Member[] = res.profileData;

        return messages.map((v, i) => {
            return {
                message: v,
                profileData: profileData.find((v2) => v2.id === v.profile_id),
            };
        });
    }

    return [];
}

export function getCachedMessages(
    roomId: string,
    cachedRooms: { [roomId: string]: FetchedMessage[] }
): FetchedMessage[] {
    // Loop over cached rooms, boom
    for (const roomIdTemp in cachedRooms) {
        if (roomIdTemp == roomId) {
            return cachedRooms[roomIdTemp];
        }
    }

    // beep boop boop beep, signal to cache new room
    // dont return [], undefined means no key
}

export function updateCachedMessages(
    roomId: string,
    messages: FetchedMessage[],
    cachedRooms: { [roomId: string]: FetchedMessage[] }
): void {
    // Just update, dont care about other messages in cache
    cachedRooms[roomId] = messages;

    cachedRoomsStore.set(cachedRooms);
}

export function pushCachedMessage(
    roomId: string,
    message: FetchedMessage,
    cachedRooms: { [roomId: string]: FetchedMessage[] }
): void {
    for (const roomIdTemp in cachedRooms) {
        if (roomIdTemp == roomId) {
            cachedRooms[roomIdTemp].push(message);

            cachedRoomsStore.set(cachedRooms);
            break;
        }
    }
}

export function removeCachedMessage(
    roomId: string,
    messageId: string,
    cachedRooms: { [roomId: string]: FetchedMessage[] }
): void {
    for (const roomIdTemp in cachedRooms) {
        if (roomIdTemp == roomId) {
            const room = cachedRooms[roomIdTemp];
            const newMessages: FetchedMessage[] = [];

            for (const messageIndex in cachedRooms[roomIdTemp]) {
                if (room[messageIndex].message.id != messageId) {
                    newMessages.push(room[messageIndex]);
                }
            }

            cachedRooms[roomIdTemp] = newMessages;

            cachedRoomsStore.set(cachedRooms);
            break;
        }
    }
}

export function isRoomCached(
    roomId: string,
    cachedRooms: { [roomId: string]: FetchedMessage[] }
): boolean {
    return roomId in cachedRooms;
}

export function removePendingMessage(
    content: string,
    pendingMessages: string[]
): void {
    const newPending: string[] = [];

    for (const pendingIndex in pendingMessages) {
        const pending = pendingMessages[pendingIndex];

        if (pending != content) {
            newPending.push(pending);
        }
    }

    pendingMessagesStore.set(newPending);
}

export async function findAccountDMId(
    profileId: string,
    dmsList: Room[]
): Promise<string> {
    return new Promise((resolve) => {
        for (const dmIndex in dmsList) {
            const dm = dmsList[dmIndex];

            if (dm.dmUser.id == profileId) {
                resolve(dm.roomId);

                return;
            }
        }

        // socket.emit(
        //     'createDM',
        //     {
        //         profileId,
        //     },
        //     ({ roomId }) => {
        //         if (roomId) {
        //             resolve(roomId);
        //             return;
        //         }
        //     }
        // );
    });
}
