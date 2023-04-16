import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const statusSpan = connectButton.getElementsByTagName("span")[0]
const showAccount = document.getElementById('showAccount')
const purchaseButton = document.getElementById('purchaseButton')
const ethInput = document.getElementById('ethInput')
const xyzInput = document.getElementById('xyzInput')
const eth_TO_xyz_RATE = 10000

connectButton.onclick = connect;
purchaseButton.onclick = purchaseTokens;

ethInput.addEventListener('input', (event) => {
  const ethAmount = parseFloat(event.target.value);
  if (isNaN(ethAmount)) {
    xyzInput.value = '';
  } else {
    const xyzAmount = ethAmount * eth_TO_xyz_RATE;
    xyzInput.value = xyzAmount.toFixed(2);
  }
});




async function connect() {
  const connectButton = document.getElementById("connectButton")
  const purchaseButton = document.getElementById("purchaseButton")

  if (typeof window.ethereum !== 'undefined') {
    let provider = window.ethereum

    try {
      const chainId = await provider.request({
        method: 'eth_chainId'
      })

      console.log('This is Chain ID: ', chainId)

      if (chainId === '0x38' || chainId === '0x61') {
        await ethereum.request({ method: 'eth_requestAccounts' })

        tokensSold()
        progress()
        rate()

        connectButton.classList.add('clicked');
        statusSpan.textContent = "Connected";   
        purchaseButton.style.display = "block"

        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
        showAccount.innerHTML = accounts
        setStatus(true)
      } else {
        statusSpan.textContent = "Switch to BSC Testnet";   
        statusSpan.style.width = "max-content"
        connectButton.onclick = () => {
          ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x38',
              chainName: 'Binance Smart Chain Testnet',
              nativeCurrency: {
                name: 'eth',
                symbol: 'eth',
                decimals: 18
              },
              rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
              blockExplorerUrls: ['https://testnet.bscscan.com/']
            }]
          })
        }
      }
    } catch (error) {
      console.log(error)
      alert("Network error. Please check your MetaMask network settings.")
    }
  } else {
        statusSpan.textContent = "Please Install Metamask";
        statusSpan.style.width = "max-content"   
    setStatus(false)
  }
}



async function purchaseTokens() {
  const amount = document.getElementById("ethInput").value
  if (amount >= 0.001) {
    console.log(`Funding with ${amount}...`)
    alert("Please wait for wallet confirmation")
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)
      try {
        const transactionResponse = await contract.buyTokens({
          value: ethers.utils.parseEther(amount),
          gasLimit: 500000,
        })
        await listenForTransactionMine(transactionResponse, provider)
        console.log("Done")
        alert("Tokens Bought!")
      } catch (error) {
        console.log(error)
      }
    } else {
      purchaseButton.innerHTML = "Please install MetaMask"
    } 
  } else {
    alert("Enter amount more than 0.001 eth!")
  }
}

async function progress() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const ethearned = await contract.progress()
      const progressDiv = document.getElementById('progress');
      progressDiv.innerText = ethers.utils.formatUnits(ethearned) + '%';
      updateProgressBar();
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  } else {
    purchaseButton.innerHTML = "Please install MetaMask"
  } 
}

async function updateProgressBar() {
  const progressBarRect = document.getElementById('progressBarRect');
  const progressBarContainer = document.querySelector('.section2__progressBarContainer');
  const progressBarWidth = progressBarContainer.offsetWidth - 4;
  const progressDiv = document.getElementById('progress');
  const ethearned = parseFloat(progressDiv.innerText.replace(',', ''));
  const ethstart = 0;
  const ethend = 50;
  const progress = Math.max(0, Math.min((ethearned - ethstart) / (ethend - ethstart), 1));
  progressBarRect.style.width = progress * progressBarWidth + 'px';
}



async function tokensSold() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const totalSold = await contract.soldTokens()
      const tokensSoldDiv = document.getElementById('tokens-sold');
      tokensSoldDiv.innerText = ethers.utils.formatUnits(totalSold) * 10 ** 9;
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  } else {
    const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/your-project-id")
    const contract = new ethers.Contract(contractAddress, abi, provider)
    const totalSold = await contract.soldTokens()
    const tokensSoldDiv = document.getElementById('tokens-sold');
    tokensSoldDiv.innerText = ethers.utils.formatUnits(totalSold) * 10 ** 9;
  }
}


async function rate() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const rate = await contract.getRate()
      return ethers.utils.formatUnits(rate) * 10 ** 18;
    } catch (error) {
      throw new Error(error.message);
    }
  } else {
    throw new Error("Please install MetaMask");
  } 
}

async function listenForTransactionMine(transactionResponse, provider) {
  const receipt = await provider.waitForTransaction(transactionResponse.hash)
  console.log(receipt)
  return receipt
}

function setStatus() {
  const statusElement = document.getElementById("status");
  statusElement.setAttribute("id", "connected");
}

