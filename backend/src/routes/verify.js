import express from "express";
import multer from "multer";
import crypto from "crypto";
import fs from "fs";
import { ethers } from "ethers";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

const contractAddress =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const abi = [
  "function getDocument(string memory documentId) public view returns (string memory,string memory,address,bool)"
];

router.post(
  "/",
  upload.single("document"),
  async (req, res) => {

    try {

      // =========================
      // GET FILE + DOCUMENT ID
      // =========================

      const file = req.file;

      const documentId =
        req.body.documentId;

      // =========================
      // VALIDATION
      // =========================

      if (!file || !documentId) {

        return res.status(400).json({
          status: "ERROR",
          message:
            "File and Document ID required",
        });
      }

      // =========================
      // GENERATE FILE HASH
      // =========================

      const fileBuffer =
        fs.readFileSync(file.path);

      const uploadedHash =
        crypto
          .createHash("sha256")
          .update(fileBuffer)
          .digest("hex");

      console.log(
        "Uploaded Hash:",
        uploadedHash
      );

      // =========================
      // CONNECT BLOCKCHAIN
      // =========================

      const provider =
        new ethers.JsonRpcProvider(
          "http://127.0.0.1:8545"
        );

      const contract =
        new ethers.Contract(
          contractAddress,
          abi,
          provider
        );

      // =========================
      // FETCH DOCUMENT
      // =========================

      const documentData =
        await contract.getDocument(
          documentId
        );

      console.log(
        "Blockchain Data:",
        documentData
      );

      const storedHash =
        documentData[0];

      const exists =
        documentData[3];

      // =========================
      // DOCUMENT NOT FOUND
      // =========================

      if (!exists) {

        return res.json({
          status: "NOT FOUND",
        });
      }

      // =========================
      // VERIFIED
      // =========================

      if (
        storedHash === uploadedHash
      ) {

        return res.json({
          status: "VERIFIED",
        });
      }

      // =========================
      // TAMPERED
      // =========================

      return res.json({
        status: "TAMPERED",
      });

    } catch (error) {

      console.error(
        "Verification Error:",
        error
      );

      return res.status(500).json({
        status: "ERROR",
        message:
          "Verification backend failed",
      });
    }
  }
);

export default router;