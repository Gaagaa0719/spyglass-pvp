export abstract class EventSignalBase<T> {
    protected callbackMap = new Map<(arg0: T) => void, boolean>();

    protected existsCallback(callback: (arg0: T) => void): boolean {
        return this.callbackMap.has(callback);
    }
    subscribe(callback: (arg0: T) => void): void {
        if (this.existsCallback(callback))
            throw new Error("このコールバックはすでに登録されています。");
        this.callbackMap.set(callback, true);
    }
    unsubscribe(callback: (arg0: T) => void): void {
        if (!this.existsCallback(callback)) throw new Error("このコールバックは未登録です。");
        this.callbackMap.delete(callback);
    }
}
