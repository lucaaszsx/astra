/**
 * @file ErrorList.ts
 * @description A class for store a list of errors with some useful functions
 * @author Lucas
 * @license MIT
 */

export class ErrorList<ErrorT> {
    private list: ErrorT[] = [];

    public get isValid(): boolean {
        return this.list.length === 0;
    }

    public append(error: ErrorT): void {
        this.list.push(error);
    }

    public has(error: ErrorT): boolean {
        return this.list.includes(error);
    }

    public toArray(): ErrorT[] {
        return this.list;
    }
}
