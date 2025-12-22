// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleContract {
    
    event IntentStored(
        bytes32 indexed id,
        address indexed sender,
        bytes data
    );

    mapping(bytes32 => bytes) public submittedIntents;
    function newIntent(bytes calldata data) public {
        bytes32 id = keccak256(
            abi.encode(
                msg.sender,
                block.number,
                block.chainid,
                data
            )
        );
        submittedIntents[id] = data;
        emit IntentStored(id, msg.sender, data);
    }
}
