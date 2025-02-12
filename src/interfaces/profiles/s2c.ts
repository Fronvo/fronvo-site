import type { AccountPost } from 'interfaces/all';

export interface S2CProfiles {
    statusUpdated: ({}: { status: string }) => void;
    postShared: ({}: { post: AccountPost }) => void;
}
