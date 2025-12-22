// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GatewayContract {
    /*
        {
        "Action": "Transfer",
        "Asset": "100 USDC",
        "Chain": "Base",
        "To": "0xAlice..."
        }
    */
    enum Actions { Transfer }
    event IntentSubmissionEvent(Actions action, string asset, string network, address destAddr);

    function submitIntent(Actions action, string memory asset, string memory network, address destAddr) public {
        emit IntentSubmissionEvent(action, asset, network, destAddr);
    }
}

