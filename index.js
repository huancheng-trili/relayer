import { ethers } from "ethers";
import fs from "fs";
import { TezosToolkit } from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";

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

async function forwardToEtherlink(data) {
  const etherlinkContract = new ethers.Contract(
    etherlinkAddress,
    etherlinkAbi,
    etherlinkWallet,
  );

  let txt = await etherlinkContract.newIntent(data);
  console.log("Transaction sent:", tx.hash);
}

const abi = JSON.parse(fs.readFileSync("dummy.abi", "utf8"));
const gatewayContractAddress = "0x0040489c7C240D0c3b1e9Ff936b4dbb8019a512e";
const provider = new ethers.WebSocketProvider(
  "wss://base-sepolia-rpc.publicnode.com",
);

const gatewayContract = new ethers.Contract(
  gatewayContractAddress,
  abi,
  provider,
);

const etherlinkAddress = "0x374a898D30E0447409e112F48715D722aF4D56CA";
const etherlinkProvider = new ethers.JsonRpcProvider(
  "https://node.ghostnet.etherlink.com",
);
let etherlinkWallet;
if (process.env.ETHERLINK_PRIVATE_KEY !== undefined) {
  etherlinkWallet = new ethers.Wallet(
    process.env.ETHERLINK_PRIVATE_KEY,
    etherlinkProvider,
  );
}
const etherlinkAbi = ["function newIntent(bytes calldata data) public"];

const Tezos = new TezosToolkit(
  "https://rpc.shadownet.tezlink.nomadic-labs.com",
);
Tezos.setProvider({
  signer: new InMemorySigner(process.env.TEZLINK_PRIVATE_KEY),
});
const tezlinkAddress = "KT1UGnBdWFNEftRhaKKbhYQhmSEczaVUWZZ1";

gatewayContract.on("IntentSubmissionEvent", async (a, b, c, d) => {
  console.log(`data: ${a} ${b} ${c} ${d}`);
  const data = ethers.hexlify(ethers.toUtf8Bytes(`data: ${a} ${b} ${c} ${d}`));
  await forwardToTezlink(data);
});
