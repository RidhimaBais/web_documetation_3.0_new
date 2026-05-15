// import { useState } from "react";
// import axios from "axios";

// function UploadForm() {

//   const [file, setFile] = useState(null);

//   const [documentId, setDocumentId] =
//     useState("");

//   const [result, setResult] =
//     useState("");

//   // ================================
//   // HANDLE FILE CHANGE
//   // ================================

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   // ================================
//   // REGISTER DOCUMENT
//   // ================================

//   const handleRegister = async () => {

//     if (!file || !documentId) {
//       alert("Please select file and enter Document ID");
//       return;
//     }

//     try {

//       const formData = new FormData();

//       formData.append("document", file);

//       formData.append(
//         "documentId",
//         documentId
//       );

//       // ================================
//       // STEP 1 — REGISTER IN BACKEND
//       // ================================

//       const registerResponse =
//         await axios.post(
//           "http://localhost:5000/register",
//           formData
//         );

//       const backendData =
//         registerResponse.data;

//       // ================================
//       // STEP 2 — CONNECT METAMASK
//       // ================================

//       if (!window.ethereum) {
//         alert("MetaMask not found");
//         return;
//       }

//       const { ethers } = await import("ethers");

//       const provider =
//         new ethers.BrowserProvider(
//           window.ethereum
//         );

//       const signer =
//         await provider.getSigner();

//       // ================================
//       // CONTRACT DETAILS
//       // ================================

//       const contractAddress =
//         "0x5FbDB2315678afecb367f032d93F642f64180aa3";

//       const abi = [
//         "function registerDocument(string memory _hash,string memory _cid,string memory _documentId) public"
//       ];

//       const contract =
//         new ethers.Contract(
//           contractAddress,
//           abi,
//           signer
//         );

//       // ================================
//       // STORE ON BLOCKCHAIN
//       // ================================

//       const tx =
//       await contract.registerDocument(
//     documentId,
//     backendData.hash,
//     backendData.cid
//   );

//       await tx.wait();

//       setResult(
//         "Document Registered Successfully"
//       );

//     } catch (error) {

//       console.error(error);

//       if (
//   error.message.includes(
//     "Document ID already exists"
//   )
// ) {

//   setResult(
//     "File is tampered or Document ID already exists"
//   );

// } else {

//   setResult("Registration Failed");
// }
//     }
//   };

//   // ================================
//   // VERIFY DOCUMENT
//   // ================================

//   const handleVerify = async () => {

//     if (!file || !documentId) {
//       alert("Please select file and enter Document ID");
//       return;
//     }

//     try {

//       const formData = new FormData();

//       formData.append("document", file);

//       formData.append(
//         "documentId",
//         documentId
//       );

//       const response = await axios.post(
//         "http://localhost:5000/verify",
//         formData
//       );

//       const data = response.data;

//       // ================================
//       // HANDLE RESULTS
//       // ================================

//       if (data.status === "VERIFIED") {

//         setResult("VERIFIED");

//       } else if (
//         data.status === "TAMPERED"
//       ) {

//         setResult("TAMPERED");

//       } else {

//         setResult("NOT FOUND");
//       }

//     } catch (error) {

//   console.error(error);

//   if (
//     error.response &&
//     error.response.data &&
//     error.response.data.message
//   ) {

//     setResult(
//       error.response.data.message
//     );

//   } else {

//     setResult("Verification Failed");
//   }
// }
//   };

//   return (
//     <div>

//       <h2>Document Authentication</h2>

//       {/* ================================
//           DOCUMENT ID INPUT
//       ================================= */}

//       <input
//         type="text"
//         placeholder="Enter Document ID"
//         value={documentId}
//         onChange={(e) =>
//           setDocumentId(e.target.value)
//         }
//       />

//       <br />
//       <br />

//       {/* ================================
//           FILE INPUT
//       ================================= */}

//       <input
//         type="file"
//         onChange={handleFileChange}
//       />

//       <br />
//       <br />

//       {/* ================================
//           BUTTONS
//       ================================= */}

//       <button onClick={handleRegister}>
//         Register
//       </button>

//       <button onClick={handleVerify}>
//         Verify
//       </button>

//       <br />
//       <br />

//       {/* ================================
//           RESULT
//       ================================= */}

//       <h3>{result}</h3>

//     </div>
//   );
// }

// export default UploadForm;



import { useRef, useState } from "react";
import axios from "axios";

function UploadForm() {
  const [file, setFile] = useState(null);

  const [documentId, setDocumentId] =
    useState("");

  const [result, setResult] =
    useState("");

  const [isDragOver, setIsDragOver] =
    useState(false);

  const fileInputRef = useRef(null);

  // ================================
  // HANDLE FILE CHANGE
  // ================================

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // ================================
  // DRAG AND DROP FILE
  // ================================

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragOver(false);

    const droppedFile =
      e.dataTransfer.files[0];

    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  // ================================
  // REGISTER DOCUMENT
  // ================================

  const handleRegister = async () => {
    if (!file || !documentId) {
      alert("Please select file and enter Document ID");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("document", file);

      formData.append(
        "documentId",
        documentId
      );

      // ================================
      // STEP 1 — REGISTER IN BACKEND
      // ================================

      const registerResponse =
        await axios.post(
          "http://localhost:5000/register",
          formData
        );

      const backendData =
        registerResponse.data;

      // ================================
      // STEP 2 — CONNECT METAMASK
      // ================================

      if (!window.ethereum) {
        alert("MetaMask not found");
        return;
      }

      const { ethers } = await import("ethers");

      const provider =
        new ethers.BrowserProvider(
          window.ethereum
        );

      const signer =
        await provider.getSigner();

      // ================================
      // CONTRACT DETAILS
      // ================================

      const contractAddress =
        "0x5FbDB2315678afecb367f032d93F642f64180aa3";

      const abi = [
        "function registerDocument(string memory _hash,string memory _cid,string memory _documentId) public"
      ];

      const contract =
        new ethers.Contract(
          contractAddress,
          abi,
          signer
        );

      // ================================
      // STORE ON BLOCKCHAIN
      // ================================

      const tx =
        await contract.registerDocument(
          documentId,
          backendData.hash,
          backendData.cid,
        );

      await tx.wait();

      setResult(
        "Document Registered Successfully"
      );

    } catch (error) {
      console.error(error);

      if (
        error.message.includes(
          "Document ID already exists"
        )
      ) {
        setResult(
          "File is tampered or Document ID already exists"
        );
      } else {
        setResult("Registration Failed");
      }
    }
  };

  // ================================
  // VERIFY DOCUMENT
  // ================================

  const handleVerify = async () => {
    if (!file || !documentId) {
      alert("Please select file and enter Document ID");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("document", file);

      formData.append(
        "documentId",
        documentId
      );

      const response = await axios.post(
        "http://localhost:5000/verify",
        formData
      );

      const data = response.data;

      // ================================
      // HANDLE RESULTS
      // ================================

      if (data.status === "VERIFIED") {
        setResult("VERIFIED");
      } else if (
        data.status === "TAMPERED"
      ) {
        setResult("TAMPERED");
      } else {
        setResult("NOT FOUND");
      }

    } catch (error) {
      console.error(error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setResult(
          error.response.data.message
        );
      } else {
        setResult("Verification Failed");
      }
    }
  };

  return (
    <div className="upload-section">

      <h2>Document Authentication</h2>

      {/* ================================
          DOCUMENT ID INPUT
      ================================= */}

      <input
        type="text"
        placeholder="Enter Document ID"
        value={documentId}
        onChange={(e) =>
          setDocumentId(e.target.value)
        }
      />

      <br />
      <br />

      {/* ================================
          DRAG AND DROP FILE INPUT
      ================================= */}

      <div
        className={
          isDragOver
            ? "drop-zone drag-over"
            : "drop-zone"
        }
        onClick={openFilePicker}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <div className="drop-icon-wrap">
          📄
        </div>

        <p className="drop-text-main">
          {file
            ? file.name
            : "Drag & Drop Document Here"}
        </p>

        <p className="drop-text-sub">
          {file
            ? "File selected successfully"
            : "or click to choose file"}
        </p>
      </div>

      <br />
      <br />

      {/* ================================
          BUTTONS
      ================================= */}

      <button onClick={handleRegister}>
        Register
      </button>

      <button onClick={handleVerify}>
        Verify
      </button>

      <br />
      <br />

      {/* ================================
          RESULT
      ================================= */}

      <h3>{result}</h3>

    </div>
  );
}

export default UploadForm;
