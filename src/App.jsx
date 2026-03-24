// src/App.jsx
import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Swap from "./Swap";
import "@solana/wallet-adapter-react-ui/styles.css";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 20,
        background: "radial-gradient(circle at top, #0a0b0f, #050506)",
        color: "white",
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ color: "#00fff7", marginBottom: 20 }}>🚀 MIOW SWAP</h1>

      {/* Wallet connect button */}
      <div style={{ marginBottom: 30 }}>
        <WalletMultiButton
          style={{
            background: "linear-gradient(90deg, #6c5ce7, #00fff7)",
            color: "white",
            fontWeight: 600,
            padding: "10px 20px",
            borderRadius: 12,
            boxShadow: "0 4px 20px rgba(0,255,247,0.3)",
            border: "none",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Swap */}
      <Swap />
    </div>
  );
}
