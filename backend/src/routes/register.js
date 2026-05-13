import express from "express";

// Multer helps receive uploaded files
import multer from "multer";

// Crypto helps generate SHA-256 hash
import crypto from "crypto";

// FS means File System
// Used for reading uploaded files
import fs from "fs";

// Axios helps backend call external APIs
import axios from "axios";

// FormData helps send file to Pinata in multipart format
import FormData from "form-data";

// Create Express router
const router = express.Router();


// Multer configuration
// Uploaded files temporarily go inside uploads folder
const upload = multer({ dest: "uploads/" });


// POST route for document registration
router.post("/", upload.single("document"), async (req, res) => {

  try {

    // ======================================================
    // STEP 1 — CREATE FORM DATA FOR PINATA
    // ======================================================

    // Create multipart form container
    const data = new FormData();


    // Add uploaded file into form data
    data.append(
      "file",

      // Read uploaded file as stream
      fs.createReadStream(req.file.path)
    );



    // ======================================================
    // STEP 2 — UPLOAD FILE TO PINATA (IPFS)
    // ======================================================

    const pinataResponse = await axios.post(

      // Pinata upload API endpoint
      "https://api.pinata.cloud/pinning/pinFileToIPFS",

      // Form data containing uploaded file
      data,

      {
        maxBodyLength: Infinity,

        headers: {

          // Automatically set multipart headers
          ...data.getHeaders(),

          // Pinata API key from .env
          pinata_api_key: process.env.PINATA_API_KEY,

          // Pinata secret key from .env
          pinata_secret_api_key:
            process.env.PINATA_SECRET_API_KEY,
        },
      }
    );



    // ======================================================
    // STEP 3 — GET CID FROM PINATA RESPONSE
    // ======================================================

    // CID = unique IPFS file identifier
    const cid = pinataResponse.data.IpfsHash;

    console.log("IPFS CID:", cid);



    // ======================================================
    // STEP 4 — READ FILE BUFFER
    // ======================================================

    // Read uploaded file contents
    const fileBuffer = fs.readFileSync(req.file.path);



    // ======================================================
    // STEP 5 — GENERATE SHA-256 HASH
    // ======================================================

    const hash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");

    console.log("Backend generated hash:", hash);



    // ======================================================
    // STEP 6 — SEND RESPONSE BACK TO FRONTEND
    // ======================================================

    res.json({

      // Success message
      message: "Hash generated successfully",

      // SHA-256 document hash
      hash: hash,

      // IPFS CID
      cid: cid,
      

      // IPFS public URL
      ipfsUrl:
        `https://gateway.pinata.cloud/ipfs/${cid}`,
    });

  } catch (error) {

    // Print full error in terminal
    console.error(error);


    // Send error response to frontend
    res.status(500).json({
      error: "Registration failed",
    });
  }
});


// Export router
export default router;