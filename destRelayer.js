import fs from "fs";
import { ethers } from "ethers";

const TZKT_API = "https://api.shadownet.tezlink.tzkt.io/v1/ws";
const CONTRACT = "KT1UGnBdWFNEftRhaKKbhYQhmSEczaVUWZZ1";
const ETHERLINK_GATEWAY_ADDRESS = "0x1B0824837947d53804c55d00dA03176d3BC73247";
const abi = JSON.parse(fs.readFileSync("etherlink_gateway.abi", "utf8"));
const etherlinkProvider = new ethers.JsonRpcProvider(
  "https://node.ghostnet.etherlink.com",
);
let etherlinkWallet = new ethers.Wallet(
  process.env.ETHERLINK_PRIVATE_KEY,
  etherlinkProvider,
);

import { EventsService } from "@tzkt/sdk-events";

const events = new EventsService({ url: TZKT_API, reconnect: true });

const sub = events
  .operations({ types: ["transaction"], address: CONTRACT })
  .subscribe({
    next: async (v) => {
      console.log(1, v);
      const etherlinkContract = new ethers.Contract(
        ETHERLINK_GATEWAY_ADDRESS,
        abi,
        etherlinkWallet,
      );

      let tx = await etherlinkContract.completeIntent(
        "0",
        "foo",
        "b",
        "0xD1dc9c0C60D963eDaD2e60DbBa788E4cEE4D017c",
        "0x0040489c7C240D0c3b1e9Ff936b4dbb8019a512e",
      );
      console.log("Transaction sent:", tx.hash);
    },
  });
