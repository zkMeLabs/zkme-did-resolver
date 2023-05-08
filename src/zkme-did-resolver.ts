import * as log4js from "log4js";
import * as networkConfiguration from "./configuration.json";
import { ethers } from "ethers";
import { DIDResolutionResult, DIDResolver, ParsedDID } from 'did-resolver';
const abi = require("./abi.json");


const logger = log4js.getLogger();
logger.level = `debug`;

/**
 * Resolves DID Document.
 * @param did
 * @returns Return DID Document on chain.
 */

export function getResolver (): Record<string, DIDResolver> {
      async function resolve(did: string, parsed?: ParsedDID): Promise<DIDResolutionResult> {

            const didDocumentMetadata = {}
            try {
                  let errorMessage: string;
                  let url: string;
                  let contractAddress: string;
                  const didWithTestnet: string = await splitZkMeDid(did);
      
                  if (
                        (did &&
                              didWithTestnet === "testnet" &&
                              did.match(/^did:zkme:testnet:0x[0-9a-fA-F]{40}$/)) ||
                        (did && did.match(/^did:zkme:0x[0-9a-fA-F]{40}$/))
                  ) {
                        if (
                              (didWithTestnet === "testnet" &&
                                    did.match(/^did:zkme:testnet:\w{0,42}$/)) ||
                              did.match(/^did:zkme:\w{0,42}$/)
                        ) {
                              if (did && didWithTestnet === "testnet") {
                                    url = `${networkConfiguration[0].testnet?.URL}`;
                                    contractAddress = `${networkConfiguration[0].testnet?.CONTRACT_ADDRESS}`;
                              } else {
                                    url = `${networkConfiguration[1].mainnet?.URL}`;
                                    contractAddress = `${networkConfiguration[1].mainnet?.CONTRACT_ADDRESS}`;
                              }
      
                              const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(
                                    url
                              );
                              const registry: ethers.Contract = new ethers.Contract(
                                    contractAddress,
                                    abi,
                                    provider
                              );
      
                              const didAddress: string =
                                    didWithTestnet === "testnet" ? did.split(":")[3] : didWithTestnet;
      
                              // Calling smart contract with getting DID Document
                              let didDocument: any = await registry.functions
                                    .getDIDDoc(didAddress)
                                    .then((resValue: any) => {
                                          return resValue;
                                    });
      
                              logger.debug(
                                    `[resolveDID] readDIDDoc - ${JSON.stringify(didDocument)} \n\n\n`
                              );
      
                              if (didDocument && !didDocument.includes("")) {
                                    return{
                                          didDocument,
                                          didDocumentMetadata,
                                          didResolutionMetadata: {contentType: 'application/did+ld+json'}
                                    }
                              } else {
                                    errorMessage = `The DID document for the given DID was not found!`;
                                    logger.error(errorMessage);
                                    throw new Error(errorMessage);
                              }
                        } else {
                              errorMessage = `Invalid address has been entered!`;
                              logger.error(errorMessage);
                              throw new Error(errorMessage);
                        }
                  } else {
                        errorMessage = `Invalid DID has been entered!`;
                        logger.error(errorMessage);
                        throw new Error(errorMessage);
                  }
            } catch (error) {
                  logger.error(`Error occurred in resolve function ${error}`);
                  throw error;
            }
      }
      return { zkme: resolve };
}
    

/**
 * Split zkMe DID.
 * @param did
 * @returns Returns Split data value to zkMe DID.
 */
async function splitZkMeDid(did: string): Promise<string> {
      const splitDidValue: string = did.split(":")[2];
      return splitDidValue;
}
