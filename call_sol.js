import * as anchor from "@coral-xyz/anchor";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
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

await program.methods
  .submitIntent({ transfer: {} }, "a", "a", "a")
  .accounts({
    user: provider.wallet.publicKey,
  })
  .rpc();
