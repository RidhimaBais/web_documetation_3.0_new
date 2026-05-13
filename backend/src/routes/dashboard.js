import express from "express";
import fs from "fs";
import { ethers } from "ethers";

const router = express.Router();


// Your deployed contract address
const contractAddress =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";


// Read contract ABI
const contractJson = JSON.parse(
  fs.readFileSync(
    "../blockchain/artifacts/contracts/DocumentAuth.sol/DocumentAuth.json",
    "utf8"
  )
);


// Extract ABI
const abi = contractJson.abi;


// Dashboard route
router.get("/", async (req, res) => {

  try {

    // Connect to local Hardhat blockchain
    const provider =
      new ethers.JsonRpcProvider(
        "http://127.0.0.1:8545"
      );


    // Connect contract
    const contract = new ethers.Contract(
      contractAddress,
      abi,
      provider
    );


    // Read all DocumentRegistered events
    const events = await contract.queryFilter(
      contract.filters.DocumentRegistered(),
      0,
      "latest"
    );


    // Arrays for dashboard data
    const registeredDocuments = [];
    const transactions = [];
    const verificationLogs = [];

    const issuersMap = {};


    // Loop through all blockchain events
    for (const event of events) {

      // Get document hash
      const hash = event.args.hash || event.args[0];

      const cid = event.args.cid || event.args[1];

      const issuer = event.args.issuer || event.args[2];


      // Get block details
      const block =
        await provider.getBlock(event.blockNumber);


      // Convert blockchain timestamp
      const time = new Date(
        Number(block.timestamp) * 1000
      ).toLocaleString();


      // Registered documents section
      registeredDocuments.push({

  // Document SHA-256 hash
  hash,

  // IPFS CID
  cid,

  // Wallet address
  issuer,

  // Registration time
  time,
});


      // Transaction history section
      transactions.push({
        txHash: event.transactionHash,
        action: "Register Document",
        status: "Success",
      });


      // Verification logs section
      verificationLogs.push({
        hash,
        result: "Valid",
        time,
      });


      // Issuer details section
      issuersMap[issuer] = {
        address: issuer,
        authorized: true,
      };
    }


    // Send dashboard response
    res.json({

      registeredDocuments:
        registeredDocuments.reverse(),

      transactions:
        transactions.reverse(),

      verificationLogs:
        verificationLogs.reverse(),

      issuers:
        Object.values(issuersMap),
    });

  } catch (error) {

    console.error(
      "Dashboard route error:",
      error
    );

    res.status(500).json({
      error: "Dashboard fetch failed",
    });
  }
});


// Export route
export default router;