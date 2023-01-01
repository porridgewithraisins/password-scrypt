# password-scrypt

A simple, promise-aware password hashing and verification library wrapping over the `scrypt` implementation available in the Node.js [crypto module](https://nodejs.org/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback).

It is an alternative to the `bcrypt` and `argon2` libraries both of which require native dependencies.

Suitable for web apps.

## Features

-   Zero dependencies.

-   Written in Typescript.

-   No optional parameters, just a simple API, with sensible options chosen for you.

-   No reinvention of the wheel. Node.js APIs are directly used, so it is fast and secure.
    -   Salts are generated using the cryptographically secure `crypto.randomBytes` function.
    -   Timing attacks are prevented by using the `crypto.timingSafeEqual` function for comparing hashes.

## Installation

```bash
npm install password-scrypt
```

## API

```ts
hash: (password: string) => Promise<string>;

verify: (plaintext: string, ciphertext: string) => Promise<boolean>;
```

## Usage

```ts
// Typescript
import * as Password from "password-scrypt";
// Javascript
const Password = require("password-scrypt");

const sample = "elephant-whale-zebra-1-2-3";

const hashed = await Password.hash(sample);

const isMatch = await Password.verify(sample, hashed); // true

const isNotMatch = await Password.verify("whale-dolphin-shark-1-2-3", hashed); // false
```
