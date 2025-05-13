import { Err, Ok, Result } from "ts-results";

export function tryCatch<E = unknown, T = unknown>(fn: () => T | Promise<T>): Result<T, E> | Promise<Result<T, E>> {
    try {
        const result = fn();

        if (result instanceof Promise) {
            return new Promise((resolve) => {
                const res = result as Promise<T>;
                res.then(result => resolve(Ok(result)))
                    .catch(err => resolve(Err(err)));
            });
        }
        else {
            return Ok(result as T);
        }
    }
    catch (err) {
        return Err(err as E);
    }
}
