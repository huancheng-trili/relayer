import { ethers } from "ethers";
import fs from 'fs';

const abi = JSON.parse(fs.readFileSync('dummy.abi', 'utf8'));
const args = process.argv.slice(2);
const contractAddress = args[0];
const provider = new ethers.WebSocketProvider("wss://base-sepolia-rpc.publicnode.com");

const contract = new ethers.Contract(contractAddress, abi, provider);

const etherlinkAddress = "0x374a898D30E0447409e112F48715D722aF4D56CA";
const etherlinkProvider = new ethers.JsonRpcProvider("https://node.ghostnet.etherlink.com");
const etherlinkWallet = new ethers.Wallet(process.env.ETHERLINK_PRIVATE_KEY, etherlinkProvider);
const etherlinkAbi = [
    "function newIntent(bytes calldata data) public",
];

const etherlinkContract = new ethers.Contract(etherlinkAddress, etherlinkAbi, etherlinkWallet);

contract.on("IntentSubmissionEvent", (a, b, c, d) => {
    console.log(`data: ${a} ${b} ${c} ${d}`);
    const data = ethers.hexlify(ethers.toUtf8Bytes(`data: ${a} ${b} ${c} ${d}`));
    etherlinkContract.newIntent(data).then((tx) => {
        console.log("Transaction sent:", tx.hash);
    }).catch(e => console.error(e));
});
