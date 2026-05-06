import { BlocklistType } from '@prisma/client';
export declare class AddBlocklistDto {
    type: BlocklistType;
    value: string;
    reason?: string;
}
