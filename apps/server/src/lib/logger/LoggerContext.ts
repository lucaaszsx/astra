/**
 * @file LoggerContext.ts
 * @description Provides a logger context for printing messages with request information.
 * @author Lucas
 * @license MIT
 */

import { AsyncLocalStorage } from 'node:async_hooks';

export type RequestContext = {
    requestId: string;
    identifier: string;
    method: string;
    path: string;
};

class LoggerContext {
    private asyncLocalStorage: AsyncLocalStorage<RequestContext>;

    constructor() {
        this.asyncLocalStorage = new AsyncLocalStorage();
    }

    public run<T>(context: RequestContext, callback: () => T): T {
        return this.asyncLocalStorage.run(context, callback);
    }

    public getContext(): Partial<RequestContext> {
        return this.asyncLocalStorage.getStore() || {};
    }

    public updateContext(updates: Partial<RequestContext>): void {
        const store = this.asyncLocalStorage.getStore();

        if (store) Object.assign(store, updates);
    }
}

export const loggerContext = new LoggerContext();
