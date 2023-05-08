import { testDid, privateKey, url, contractAddress } from "./test.data";
import * as didZkMe from '../src/zkme-did-resolver';
import * as didResolvers from "did-resolver";

jest.setTimeout(30000);
let resolveDidRes:any;

beforeAll(async () => {
    let resolver: didResolvers.Resolver
    {
        resolver = new didResolvers.Resolver(
            {
                ...didZkMe.getResolver(),
            },

            { cache: true }
        )
    }
   resolveDidRes = await resolver.resolve(testDid)
})

describe("test resolver function", () => {



    it('should be zkMe DID for resolve DID', async () => {
        if (testDid && testDid.split(':')[2] === 'testnet') {

            await expect(testDid).toBeDefined();
            await expect(testDid).not.toBeNull();
            await expect(testDid).not.toBe('');
            await expect(testDid.slice(0, 16)).toMatch('did:zkme:testnet');
            await expect(testDid.slice(17, 19)).toMatch('0x');
            await expect(testDid.split(":")[3].length).toBe(42);
        } else {

            await expect(testDid).toBeDefined();
            await expect(testDid).not.toBeNull();
            await expect(testDid).not.toBe('');
            await expect(testDid.slice(0, 8)).toMatch('did:zkme');
            await expect(testDid.slice(9, 11)).toMatch('0x');
            await expect(testDid.split(":")[2].length).toBe(42);
        }
    })
    
    it('should get DID document', async () => {
         await expect(resolveDidRes.didDocument).not.toBeNull();
         
         
    })

    it('should be private key for resolve DID', async () => {
        await expect(privateKey).not.toBeNull();
        await expect(privateKey).not.toBe('');
        await expect(privateKey.length).toBe(66);
        await expect(privateKey.slice(0, 2)).toMatch('0x');

    })
});
