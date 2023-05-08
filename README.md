# zkMe DID Resolver

The zkME resolver library is used for resolving DID’s in zkMe Method Space. The module is supposed to be used as an integration to zkMe library.

## Install

```
npm install
```

## Usage

In combination with the DID-Resolver:

```js
import { resolveDID } from "zkme-did-resolver";
const didDocument = await resolveDID(did);
```
The function returns a DID Document.

## Testing

For testing use the command

```
npm run test
```
