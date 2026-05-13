// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DocumentAuth {

    // =========================================
    // DOCUMENT STRUCT
    // =========================================

    struct Document {

        // Original SHA-256 hash
        string hash;

        // IPFS CID
        string cid;

        // Wallet that registered document
        address issuer;

        // Whether document exists
        bool exists;
    }


    // =========================================
    // STORAGE
    // =========================================

    // documentId => Document data
    mapping(string => Document) public documents;


    // =========================================
    // AUTHORIZED ISSUERS
    // =========================================

    mapping(address => bool) public authorizedIssuers;


    // =========================================
    // OWNER
    // =========================================

    address public owner;


    // =========================================
    // EVENTS
    // =========================================

    event DocumentRegistered(
        string documentId,
        string hash,
        string cid,
        address issuer
    );

    event IssuerAuthorized(address issuer);


    // =========================================
    // CONSTRUCTOR
    // =========================================

    constructor() {

        owner = msg.sender;

        authorizedIssuers[msg.sender] = true;
    }


    // =========================================
    // AUTHORIZE ISSUER
    // =========================================

    function authorizeIssuer(address issuer) public {

        require(msg.sender == owner, "Only owner can authorize");

        authorizedIssuers[issuer] = true;

        emit IssuerAuthorized(issuer);
    }


    // =========================================
    // REGISTER DOCUMENT
    // =========================================

    function registerDocument(
        string memory documentId,
        string memory hash,
        string memory cid
    ) public {

        // Check issuer authorization
        require(
            authorizedIssuers[msg.sender],
            "Not authorized"
        );

        // Prevent duplicate document IDs
        require(
            !documents[documentId].exists,
            "Document ID already exists"
        );

        // Store document
        documents[documentId] = Document({
            hash: hash,
            cid: cid,
            issuer: msg.sender,
            exists: true
        });

        emit DocumentRegistered(
            documentId,
            hash,
            cid,
            msg.sender
        );
    }


    // =========================================
    // VERIFY DOCUMENT
    // =========================================

    function verifyDocument(
        string memory documentId,
        string memory uploadedHash
    ) public view returns (string memory) {

        // Document ID does not exist
        if (!documents[documentId].exists) {

            return "NOT FOUND";
        }

        // Compare hashes
        if (
            keccak256(
                abi.encodePacked(
                    documents[documentId].hash
                )
            )
            ==
            keccak256(
                abi.encodePacked(uploadedHash)
            )
        ) {

            return "VERIFIED";
        }

        // Document exists but hash differs
        return "TAMPERED";
    }


    // =========================================
    // GET DOCUMENT
    // =========================================

    function getDocument(
        string memory documentId
    )
        public
        view
        returns (
            string memory,
            string memory,
            address,
            bool
        )
    {

        Document memory doc = documents[documentId];

        return (
            doc.hash,
            doc.cid,
            doc.issuer,
            doc.exists
        );
    }
}