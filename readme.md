# Relayer

Source chain gateway contract -> Hub contract -> Destination chain gateway contract

## Deploy smart contracts

### Source chain gateway

Using Base Sepolia as an example.

```
# Import and fund deployer wallet first
# cast wallet import deployer --interactive

BASE_SEPOLIA_RPC_URL="https://sepolia.base.org"
forge create dummy.sol:GatewayContract --rpc-url $BASE_SEPOLIA_RPC_URL \
    --account deployer --password '' --json | jq .abi > dummy.abi

forge create dummy.sol:GatewayContract --rpc-url $BASE_SEPOLIA_RPC_URL \
    --account deployer --password '' --broadcast

# stdout: Deployed to: <address>
```

### Hub contract

#### Tezlink shadownet

```
# Set up and fund deployer account first
octez-client -E https://rpc.shadownet.tezlink.nomadic-labs.com originate contract tezlink.tz \
    transferring 0 from deployer running tezlink.tz --init '{}' --burn-cap 1

# stdout: New contract <address> originated.
```

#### Etherlink ghostnet

```
# Import and fund deployer wallet first
# cast wallet import deployer --interactive

ETHERLINK_GHOSTNET_RPC_URL="https://node.ghostnet.etherlink.com"
forge create etherlink.sol:SimpleContract --rpc-url $ETHERLINK_GHOSTNET_RPC_URL \
    --account deployer --password '' --json | jq .abi > dummy.abi

forge create etherlink.sol:SimpleContract --rpc-url $ETHERLINK_GHOSTNET_RPC_URL \
    --account deployer --password '' --broadcast

# stdout: Deployed to: <address>
```

## Run source-hub relayer

* Update contract addresses in `index.js`
* `npm run run`

### Send a dummy intent

```
cast send 0x0040489c7C240D0c3b1e9Ff936b4dbb8019a512e \
    --rpc-url "https://sepolia.base.org" \
    "submitIntent(uint8, string, string, address)" \
    0 foo a 0x0040489c7C240D0c3b1e9Ff936b4dbb8019a512e \
    --account deployer --password ''
```
