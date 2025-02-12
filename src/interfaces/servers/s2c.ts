import type { Channel, FronvoAccount, Server } from 'interfaces/all';

export interface S2CServers {
    serverCreated: ({}: { server: Server }) => void;
    serverJoined: ({}: { server: Server }) => void;
    serverEdited: ({}: { server: Server }) => void;
    serverDeleted: ({}: { id: string }) => void;
    serverLeft: ({}: { id: string }) => void;
    inviteRegenerated: ({}: { server: Server; invite: string }) => void;
    inviteToggled: ({}: { server: Server; state: boolean }) => void;
    channelCreated: ({}: { server: Server; channel: Channel }) => void;
    channelEdited: ({}: { server: Server; channel: Channel }) => void;
    channelDeleted: ({}: { server: Server; channelId: string }) => void;
    memberJoined: ({}: { server: Server; member: FronvoAccount }) => void;
    memberLeft: ({}: { server: Server; member: FronvoAccount }) => void;
    memberBanned: ({}: { server: Server; member: FronvoAccount }) => void;
    memberUnbanned: ({}: { server: Server; member: FronvoAccount }) => void;
}
