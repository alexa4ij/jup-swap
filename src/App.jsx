// src/App.jsx
import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Swap from "./Swap";
import "@solana/wallet-adapter-react-ui/styles.css";

export default function App() {
  const wrapperStyle = {
    minHeight: "100vh",
    padding: "20px 10px", // responsive padding
    background: "radial-gradient(circle at top, #0a0b0f, #050506)",
    color: "white",
    fontFamily: "sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
  };

  const titleStyle = {
    color: "#00fff7",
    marginBottom: 20,
    fontSize: 22,
    fontWeight: 600,
    textAlign: "center",
  };

  const walletButtonStyle = {
    width: "100%",
    maxWidth: 250, // tombol maksimal 250px di desktop
    background: "linear-gradient(90deg, #6c5ce7, #00fff7)",
    color: "white",
    fontWeight: 600,
    padding: "10px 0",
    borderRadius: 12,
    boxShadow: "0 4px 20px rgba(0,255,247,0.3)",
    border: "none",
    cursor: "pointer",
    marginBottom: 30,
  };

  return (
    <div style={wrapperStyle}>
      <h1 style={titleStyle}>MiowSwap</h1>

      <WalletMultiButton style={walletButtonStyle} />

      {/* Swap component tetap dipakai */}
      <Swap />
    </div>
  );
}
