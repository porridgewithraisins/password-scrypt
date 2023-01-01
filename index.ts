import type { BinaryLike } from "node:crypto";
import * as Crypto from "node:crypto";

/* API */

export { hash, verify };

/* Core */

const KEY_LEN = 64;
const SALT_LEN = 32;
const SEPARATOR = ".";
const ENCODING = "hex";

const scryptPromisified = promisify<OverloadUsed>(Crypto.scrypt);

async function hash(password: string) {
    if (typeof password !== "string")
        return Promise.reject(new TypeError("Password expected a string, got " + typeof password));

    const salt = Crypto.randomBytes(SALT_LEN).toString(ENCODING);

    const hash = (await scryptPromisified(password, salt, KEY_LEN)).toString(ENCODING);

    return hash + SEPARATOR + salt;
}

async function verify(plaintext: string, ciphertext: string) {
    if (typeof plaintext !== "string")
        return Promise.reject(
            new TypeError("Plaintext expected a string, got " + typeof plaintext)
        );
    if (typeof ciphertext !== "string")
        return Promise.reject(
            new TypeError("Ciphertext expected a string, got " + typeof ciphertext)
        );

    const [hash, salt] = ciphertext.split(SEPARATOR);

    const candidate = await scryptPromisified(plaintext, salt, KEY_LEN);

    return Crypto.timingSafeEqual(Buffer.from(hash, ENCODING), candidate);
}

/* Internals */

function promisify<Func extends (...args: any[]) => any>(fn: Func) {
    return (...args: InitialParameters<Func>) =>
        new Promise<LastParameter<Func> extends (err: any, res: infer Ret) => void ? Ret : never>(
            (resolve, reject) =>
                fn(...args, (err: any, res: any) => (err ? reject(err) : resolve(res)))
        );
}

type OverloadUsed = (
    password: BinaryLike,
    salt: BinaryLike,
    keylen: number,
    callback: (err: Error | null, derivedKey: Buffer) => void
) => void;

type InitialParameters<F extends (...args: any[]) => any> = Parameters<F> extends [...infer I, any]
    ? I
    : never;

type LastParameter<F extends (...args: any[]) => any> = Parameters<F> extends [...any, infer L]
    ? L
    : never;
