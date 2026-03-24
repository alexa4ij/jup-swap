import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Swap from "./Swap";

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>🚀 Simple Jupiter DEX</h1>
      <WalletMultiButton />
      <Swap />
    </div>
  );
}
