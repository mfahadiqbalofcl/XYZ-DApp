# XYZ DApp

A simple, fully client-side decentralized application (DApp) for a token presale / crowdsale. The frontend lets a visitor connect a Web3 wallet (MetaMask), see live presale stats (tokens sold, progress, rate) pulled straight from the smart contract, and buy the XYZ token with BNB on the Binance Smart Chain.

This is a learning / showcase project: no backend, no build step — just static HTML, CSS, and ES-module JavaScript talking to an on-chain `Crowdsale` contract via ethers.js.

## Live demo

https://mfahadiqbalofcl.github.io/XYZ-DApp/

## Features

- Connect / disconnect a MetaMask wallet
- Network detection with one-click "Add / Switch to BSC" prompt
- Live presale data read from the contract (`soldTokens`, `progress`, `getRate`)
- Buy tokens with BNB, with min/max purchase validation
- Animated progress bar reflecting funds raised
- Responsive landing-page UI

## Tech stack

- **Frontend:** static HTML, CSS, vanilla JavaScript (ES modules)
- **Web3:** [ethers.js 5.6](https://docs.ethers.org/v5/) (bundled in `assets/auth/`)
- **Wallet:** MetaMask / EIP-1193 provider
- **Chain:** Binance Smart Chain (mainnet `0x38` / testnet `0x61`)
- **Smart contract:** Solidity `^0.8`, OpenZeppelin (`Ownable`, `IERC20`, `SafeMath`) — see `assets/auth/presale.sol`
- **Hosting:** GitHub Pages

## Smart contract

The `Crowdsale` contract (`assets/auth/presale.sol`) collects BNB and transfers ERC-20 tokens to the buyer at a configurable rate, forwarding funds to the owner wallet. The deployed address the frontend talks to is in `assets/auth/constants.js` (`contractAddress`).

## Running locally

Because the app uses native ES modules, open it through a local web server (not `file://`):

```bash
# clone
git clone https://github.com/mfahadiqbalofcl/XYZ-DApp.git
cd XYZ-DApp

# serve (pick one)
python3 -m http.server 8000
# or
npx serve .
```

Then open http://localhost:8000 and connect MetaMask on the Binance Smart Chain.

## Project structure

```
.
├── index.html              # landing page + presale UI
├── assets/
│   ├── auth/
│   │   ├── index.js        # wallet connect + buy/read contract logic
│   │   ├── constants.js    # contract address + ABI
│   │   ├── presale.sol     # the Crowdsale smart contract
│   │   └── ethers-5.6...   # bundled ethers.js
│   ├── js/main.js          # UI / page interactions
│   ├── css/style.css
│   └── images/
└── README.md
```

## Screenshot

![XYZ DApp screenshot](docs/screenshot.png) <!-- TODO: add a real screenshot -->

## Disclaimer

This is a demo / educational project. The presale contract and token are for demonstration; do not send real funds without auditing the deployed contract yourself.

## License

Released under the [MIT License](LICENSE).