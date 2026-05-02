/**
 * @file PermissionsBitField.ts
 * @description Bit field class to manage permissions flags
 *
 * @remarks
 * This implementation was inspired from the following project:
 * https://github.com/lucaaszsx/discord.io/blob/main/lib/helpers/PermissionsFlagsBits.js
 *
 * The final code was adapted to fit this application.
 *
 * @author Lucas
 * @license MIT
 */

import { PermissionsFlags } from '../constants/PermissionsFlags';
import { BitField } from './BitField';

export class PermissionsBitField extends BitField<typeof PermissionsBitField.Flags> {
    public static Flags = PermissionsFlags;

    constructor(bits: bigint) {
        super(bits);
    }
}
