import * as anchor from "@coral-xyz/anchor";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { TezosToolkit } from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";
import { ethers } from "ethers";
import { Connection, Keypair } from "@solana/web3.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const secret = JSON.parse(fs.readFileSync("wallet-keypair.json", "utf-8"));

const keypair = Keypair.fromSecretKey(new Uint8Array(secret));

const wallet = new anchor.Wallet(keypair);

const provider = new anchor.AnchorProvider(connection, wallet, {
  commitment: "confirmed",
});

const idlPath = path.resolve(__dirname, "solana_gateway_idl.json");
const idl = JSON.parse(fs.readFileSync(idlPath, "utf8"));

const program = new anchor.Program(idl, provider);

console.log("Listening for IntentSubmissionEvent events...");

const listener = program.addEventListener(
  // event name needs to be in camel case
  "intentSubmissionEvent",
  async (event, slot) => {
    console.log("------ EVENT RECEIVED ------");
    console.log("Slot:", slot);
    console.log("Event:", event);
    const data = ethers.hexlify(ethers.toUtf8Bytes(`data: ${event}`));
    await forwardToTezlink(data);
  },
);

const Tezos = new TezosToolkit(
  "https://rpc.shadownet.tezlink.nomadic-labs.com",
);
Tezos.setProvider({
  signer: new InMemorySigner(process.env.TEZLINK_PRIVATE_KEY),
});
const tezlinkAddress = "KT1UGnBdWFNEftRhaKKbhYQhmSEczaVUWZZ1";

async function forwardToTezlink(data) {
  const tezlinkContract = await Tezos.contract.at(tezlinkAddress);

  console.log(`sending data to tezlink`);
  const operation = await tezlinkContract.methodsObject.default(data).send();

  console.log(`Waiting for ${operation.hash} to be confirmed...`);
  const level = await operation.confirmation(1);

  console.log(
    `Operation injected at level ${level}: https://shadownet.tezlink.tzkt.io/${operation.hash}`,
  );
}

process.on("SIGINT", async () => {
  console.log("\nRemoving listener...");
  await program.removeEventListener(listener);
  process.exit(0);
});
