export class Lock {
    private static acquiredLocks: Map<unknown, boolean> = new Map();

    /**
     * Acquires an exclusive lock on the specified object.
     * @param obj The object on which to acquire the lock.
     */
    public static enter(obj: unknown) {
        if (this.acquiredLocks.has(obj) && this.acquiredLocks.get(obj))
            throw new Error("Cannot enter lock when the object has not been released.");

        this.acquiredLocks.set(obj, true);
    }

    /**
     * Releases an exclusive lock on the specified object.
     * @param obj The object on which to release the lock.
     */
    public static exit(obj: unknown) {
        if (this.acquiredLocks.has(obj) && !this.acquiredLocks.get(obj))
            throw new Error("Cannot exit lock when the object has not been acquired.");

        this.acquiredLocks.set(obj, false);
    }

    /**
     * Determines whether there is an exclusive lock on the specified object.
     * @param obj The object to check if it is acquired.
     * @returns `true` if there is an exclusive lock on the object, `false` otherwise.
     */
    public static isEntered(obj: unknown) {
        if (this.acquiredLocks.has(obj) && this.acquiredLocks.get(obj))
            return true;

        for (const acquiredLock of this.acquiredLocks.keys()) {
            if (shallowCompare(acquiredLock, obj))
                return true;
        }

        return false;
    }
}

function shallowCompare(obj1: unknown, obj2: unknown) {
    if (Object.is(obj1, obj2)) {
        return true;
    }

    if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        // @ts-expect-error "any" bullshit
        if (!Object.prototype.hasOwnProperty.call(obj2, key) || (typeof obj1[key] !== "object" && !Object.is(obj1[key], obj2[key]))) {
            return false;
        }
    }

    return true;
}
