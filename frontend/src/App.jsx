import UploadForm from "./components/UploadForm";
import Dashboard from "./components/Dashboard";
import WalletConnect from "./components/WalletConnect";
import { useState } from "react";

export default function App() {
  const [account, setAccount] = useState("");

  return (
    <div>
      <WalletConnect setAccount={setAccount} />

      <UploadForm account={account} />

      <Dashboard />
    </div>
  );
}