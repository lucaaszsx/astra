/**
 * @file BitField.ts
 * @description Bit field class to manage application flags
 *
 * @remarks
 * This implementation was inspired from the following project:
 * https://github.com/lucaaszsx/discord.io/blob/main/lib/helpers/Bitfield.js
 *
 * The final code was adapted to fit this application.
 *
 * @author Lucas
 * @license MIT
 */

type FlagValue<T extends Record<PropertyKey, bigint>> = T[keyof T];

export abstract class BitField<TFlags extends Record<PropertyKey, bigint>> {
    protected bits: bigint;

    protected constructor(bits: bigint = 0n) {
        this.bits = bits;
    }

    /**
     * Checks wheter all bits provided are present
     *
     * @param flag - Bits to check
     * @returns True if all bits are set
     */
    public has(flag: FlagValue<TFlags>): boolean {
        return (this.bits & flag) === flag;
    }

    /**
     * Check wheter any of provided bits are present
     *
     * @param flag - Bits to check
     * @returns True if at least one bit is set
     */
    public any(flag: FlagValue<TFlags>): boolean {
        return (this.bits & flag) !== 0n;
    }

    /**
     * Adds the given bits to the bit field
     *
     * @param flag - Bits to add
     * @returns The current instance
     */
    public add(flag: FlagValue<TFlags>): this {
        this.bits |= flag;

        return this;
    }

    /**
     * Removes the given bits to the bit field
     *
     * @param flag - Bits to remove
     * @returns The current instance
     */
    public remove(flag: FlagValue<TFlags>): this {
        if (this.has(flag)) this.bits ^= flag;

        return this;
    }

    /**
     * Gets the value of bit field
     *
     * @returns Current bits
     */
    public valueOf(): bigint {
        return this.bits;
    }
}
