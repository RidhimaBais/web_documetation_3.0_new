import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {

  // =========================================================
  // DASHBOARD STATE
  // =========================================================

  // Stores all dashboard-related data
  const [dashboard, setDashboard] = useState({
    registeredDocuments: [],
    transactions: [],
    verificationLogs: [],
    issuers: [],
  });

  useEffect(() => {

    // =========================================
    // FETCH DASHBOARD DATA
    // =========================================

    const loadDashboard = async () => {

      try {

        // Call backend dashboard API
        const response = await axios.get(
          "http://localhost:5000/dashboard"
        );

        // =========================================
        // SAFE STATE UPDATE
        // =========================================

        // Prevents undefined.length errors
        setDashboard({

          registeredDocuments:
            response.data.registeredDocuments || [],

          transactions:
            response.data.transactions || [],

          verificationLogs:
            response.data.verificationLogs || [],

          issuers:
            response.data.issuers || [],
        });

      } catch (error) {

        console.error(
          "Dashboard fetch failed:",
          error
        );
      }
    };

    // =========================================
    // FIRST LOAD
    // =========================================

    loadDashboard();

    // =========================================
    // AUTO REFRESH EVERY 1 SECOND
    // =========================================

    const interval = setInterval(() => {

      loadDashboard();

    }, 1000);

    // =========================================
    // CLEANUP
    // =========================================

    return () => clearInterval(interval);

  }, []);
  // =========================================================
  // CARD STYLING
  // =========================================================

  // Common styling for dashboard cards
  const cardStyle = {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "25px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  };

  // =========================================================
  // ITEM STYLING
  // =========================================================

  // Common styling for each dashboard entry
  const itemStyle = {
    padding: "12px",
    borderBottom: "1px solid #e5e5e5",
    marginBottom: "10px",
  };

  // =========================================================
  // JSX UI
  // =========================================================

  return (

    // Main dashboard container
    <div
      style={{
        maxWidth: "1100px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f7fb",
        minHeight: "100vh",
      }}
    >

      {/* =====================================================
          DASHBOARD TITLE
      ===================================================== */}

      <h1
        style={{
          textAlign: "center",
          marginBottom: "40px",
          color: "#222",
        }}
      >
        Live Dashboard
      </h1>

      {/* =====================================================
          REGISTERED DOCUMENTS SECTION
      ===================================================== */}

      <div style={cardStyle}>

        <h2 style={{ marginBottom: "20px" }}>
          Registered Documents
        </h2>

        {/* Show message if no documents exist */}
        {dashboard.registeredDocuments.length === 0 ? (

          <p>No registered documents found.</p>

        ) : (

          // Loop through all registered documents
          dashboard.registeredDocuments.map((doc, index) => (

            <div key={index} style={itemStyle}>

              {/* Document Hash */}
              <div>
                <strong>Hash:</strong>{" "}
                {doc.hash?.slice(0, 18)}...
              </div>

              {/* IPFS CID */}
              <div>
                <strong>CID:</strong>{" "}

                {doc.cid ? (

                  // Open IPFS file through Pinata gateway
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${doc.cid}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {doc.cid.slice(0, 18)}...
                  </a>

                ) : (

                  // If CID missing
                  "Not Available"
                )}
              </div>

              {/* Wallet Address of Issuer */}
              <div>
                <strong>Issuer:</strong>{" "}
                {doc.issuer?.slice(0, 18)}...
              </div>

              {/* Registration Time */}
              <div>
                <strong>Time:</strong> {doc.time}
              </div>

            </div>
          ))
        )}
      </div>

      {/* =====================================================
          TRANSACTION HISTORY SECTION
      ===================================================== */}

      <div style={cardStyle}>

        <h2 style={{ marginBottom: "20px" }}>
          Transaction History
        </h2>

        {/* Show message if no transactions exist */}
        {dashboard.transactions.length === 0 ? (

          <p>No transactions found.</p>

        ) : (

          // Loop through transaction list
          dashboard.transactions.map((tx, index) => (

            <div key={index} style={itemStyle}>

              {/* Transaction Hash */}
              <div>
                <strong>Transaction:</strong>{" "}
                {tx.txHash?.slice(0, 20)}...
              </div>

              {/* Transaction Action */}
              <div>
                <strong>Action:</strong> {tx.action}
              </div>

              {/* Transaction Status */}
              <div>
                <strong>Status:</strong>{" "}

                <span
                  style={{
                    color:
                      tx.status === "Success"
                        ? "green"
                        : "red",
                    fontWeight: "bold",
                  }}
                >
                  {tx.status}
                </span>
              </div>

            </div>
          ))
        )}
      </div>

      {/* =====================================================
          VERIFICATION LOGS SECTION
      ===================================================== */}

      <div style={cardStyle}>

        <h2 style={{ marginBottom: "20px" }}>
          Verification Logs
        </h2>

        {/* Show message if no verification logs exist */}
        {dashboard.verificationLogs.length === 0 ? (

          <p>No verification logs found.</p>

        ) : (

          // Loop through verification logs
          dashboard.verificationLogs.map((log, index) => (

            <div key={index} style={itemStyle}>

              {/* Verified Document Hash */}
              <div>
                <strong>Hash:</strong>{" "}
                {log.hash?.slice(0, 18)}...
              </div>

              {/* Verification Result */}
              <div>
                <strong>Result:</strong>{" "}

                <span
                  style={{
                    color:
                      log.result === "Valid"
                        ? "green"
                        : "red",
                    fontWeight: "bold",
                  }}
                >
                  {log.result}
                </span>
              </div>

              {/* Verification Time */}
              <div>
                <strong>Time:</strong> {log.time}
              </div>

            </div>
          ))
        )}
      </div>

      {/* =====================================================
          ISSUER DETAILS SECTION
      ===================================================== */}

      <div style={cardStyle}>

        <h2 style={{ marginBottom: "20px" }}>
          Issuer Details
        </h2>

        {/* Show message if no issuers exist */}
        {dashboard.issuers.length === 0 ? (

          <p>No issuers found.</p>

        ) : (

          // Loop through issuer list
          dashboard.issuers.map((issuer, index) => (

            <div key={index} style={itemStyle}>

              {/* Issuer Wallet Address */}
              <div>
                <strong>Wallet:</strong>{" "}
                {issuer.address?.slice(0, 20)}...
              </div>

              {/* Authorization Status */}
              <div>
                <strong>Authorized:</strong>{" "}

                <span
                  style={{
                    color: issuer.authorized
                      ? "green"
                      : "red",
                    fontWeight: "bold",
                  }}
                >
                  {issuer.authorized ? "Yes" : "No"}
                </span>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
