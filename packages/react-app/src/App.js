import React from 'react';
// import { Contract } from '@ethersproject/contracts';
// import { Web3Provider } from '@ethersproject/providers'
import { ethers } from 'ethers';
import Web3 from 'web3';

import { Body, Button, Header, Image } from './components';
import logo from './ethereumLogo.png';
import useWeb3Modal from './hooks/useWeb3Modal';

// -----------------------------------------------------------------------------
const allocatorContractAddress = "0xdb9b739A2c11094f3742d4F3b1a7F702A24CEaDf";
// -----------------------------------------------------------------------------

function getWeb3Provider() {
  var web3 = window.web3;
  web3 = new Web3(web3.currentProvider);

  return web3;
}

function getWeb3JSProvider() {
  return new Web3(window.web3.currentProvider);
}

// -----------------------------------------------------------------------------

async function exitMarket(wProvider) {  
  const functionType = 'function';
  const functionName = 'exitMarket';

  const functionDefinition = {
    definition: [
      `${functionType} ${functionName}()`,
    ],
    invocation: {
      method: `${functionName}`,
      parameters: []
    }
  };

  let iface = new ethers.utils.Interface(functionDefinition.definition);
  let wABI = iface.encodeFunctionData(functionDefinition.invocation.method, functionDefinition.invocation.parameters)
  let eABI = wProvider.eth.abi.encodeFunctionCall({
      name: functionName,
      type: functionType,
      inputs: []
  }, [])
  
  console.log('func sig:', functionDefinition.definition);
  console.log('func wABI:', wABI);
  console.log('func eABI:', eABI);

  getWeb3JSProvider().eth.sendTransaction({
      to: allocatorContractAddress,
      from: wProvider.givenProvider.selectedAddress,
      data: wABI,
      gas: 1500000,
      gasPrice: wProvider.utils.toWei('50', 'gwei'),
  })
    .once('transactionHash', function(hash) {
      console.log('transactionHash -> ', hash)
    })
    .once('receipt', function(receipt) {
      console.log('receipt -> ', receipt)
    })
    .on('confirmation', function(confNumber, receipt) {
      console.log('confirmation -> ', confNumber, receipt)
    })
    .on('error', function(error) {
      console.log('error -> ', error)
    })
    .then(function(receipt) {
      console.log('receipt -> ', receipt)
    });
}

async function enterMarket(wProvider) {  
  const functionType = 'function';
  const functionName = 'enterMarket';
  // const functionParamTyp = 'uint';
  // const functionParamVal = 'ethAmount';

  // const gweiAmt = 1000000;

  const functionDefinition = {
    definition: [
      `${functionType} ${functionName}()`,
      // `${functionType} ${functionName}(${functionParamTyp} ${functionParamVal})`,
    ],
    invocation: {
      method: `${functionName}`,
      parameters: [
        // `${gweiAmt}`,
      ]
    }
  };

  let iface = new ethers.utils.Interface(functionDefinition.definition);
  let wABI = iface.encodeFunctionData(functionDefinition.invocation.method, functionDefinition.invocation.parameters)
  let eABI = wProvider.eth.abi.encodeFunctionCall({
      name: functionName,
      type: functionType,
      inputs: []
  }, [])
  
  console.log('func sig:', functionDefinition.definition);
  console.log('func wABI:', wABI);
  console.log('func eABI:', eABI);

  getWeb3JSProvider().eth.sendTransaction({
      to: allocatorContractAddress,
      from: wProvider.givenProvider.selectedAddress,
      value: wProvider.utils.toWei('2.5', 'ether'),
      data: wABI,
      gas: 2000000,
      gasPrice: wProvider.utils.toWei('1', 'gwei'),
      gasLimit: '0x5208'
  })
    .once('transactionHash', function(hash) {
      console.log('transactionHash -> ', hash)
    })
    .once('receipt', function(receipt) {
      console.log('receipt -> ', receipt)
    })
    .on('confirmation', function(confNumber, receipt) {
      console.log('confirmation -> ', confNumber, receipt)
    })
    .on('error', function(error) {
      console.log('error -> ', error)
    })
    .then(function(receipt) {
      console.log('receipt -> ', receipt)
    });
}

async function getBalanceUsingEthers(provider) {
  var web3 = window.web3;
  web3 = new Web3(web3.currentProvider);

  const address = await web3.eth.getAccounts();

  console.log('address -> ', address)

  web3.eth.getBalance(address[0]).then((balance) => {
    let etherString = ethers.utils.formatEther(balance);
    alert("Balance: " + etherString);
    console.log("Balance: " + etherString);
  });
}

async function getBalanceUsingWeb3() {
  var web3 = window.web3;
  web3 = new Web3(web3.currentProvider);

  const address = await web3.eth.getAccounts();

  web3.eth.getBalance(address[0]).then((balance) => {
    alert("Balance: " + web3.utils.fromWei(balance, 'ether'));
  });
}

async function getAccountsUsingWeb3() {
  var web3 = window.web3;
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
    web3.eth.getAccounts().then((account) => {
      alert("Account: " + account);
    });
  }
}

// function getLibrary(provider: any): Web3Provider {
//   const library = new Web3Provider(provider)
//   library.pollingInterval = 12000
//   return library
// }

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  return (
    <Button
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {!provider ? "Connect Wallet" : "Disconnect Wallet"}
    </Button>
  );
}

function App() {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const web3Provider = getWeb3Provider();

  return (
    <div>
      <Header>
        <WalletButton 
          provider={provider} 
          loadWeb3Modal={loadWeb3Modal} 
          logoutOfWeb3Modal={logoutOfWeb3Modal}
        />
      </Header>

      <Body>
        <Image src={logo} alt="react-logo" />

        <Button onClick={() => enterMarket(web3Provider)}>
          enterMarket()
        </Button>
        <br />
        
        <Button onClick={() => exitMarket(web3Provider)}>
          exitMarket()
        </Button>
        <br />

        <Button onClick={() => getBalanceUsingEthers()}>
          Get Balance Using Ethers
        </Button>
        <br />

        <Button onClick={() => getBalanceUsingWeb3()}>
          Get Balance Using Web3
        </Button>
        <br />

        <Button onClick={() => getAccountsUsingWeb3()}>
          Get Accounts Using Web3
        </Button>
        <br />
      </Body>
    </div>
  );
}

export default App;
