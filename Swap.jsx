import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";

export default function Swap() {
  const wallet = useWallet();

  const SOL = "So11111111111111111111111111111111111111112";
  const USDC = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSwap = async () => {
    try {
      if (!wallet.connected) return alert("Connect wallet dulu");

      setLoading(true);

      const lamports = Number(amount) * 1_000_000_000;

      const params = new URLSearchParams({
        inputMint: SOL,
        outputMint: USDC,
        amount: lamports.toString(),
        taker: wallet.publicKey.toBase58(),
      });

      const order = await fetch(
        `https://lite-api.jup.ag/ultra/v1/order?${params}`
      ).then((r) => r.json());

      if (order.errorCode) throw new Error(order.errorMessage);

      const tx = VersionedTransaction.deserialize(
        Buffer.from(order.transaction, "base64")
      );

      const signedTx = await wallet.signTransaction(tx);

      const signedTxBase64 = Buffer.from(
        signedTx.serialize()
      ).toString("base64");

      const result = await fetch(
        "https://lite-api.jup.ag/ultra/v1/execute",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            signedTransaction: signedTxBase64,
            requestId: order.requestId,
          }),
        }
      ).then((r) => r.json());

      if (result.status === "Success") {
        alert("✅ Swap berhasil");
      } else {
        alert("❌ Swap gagal");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Swap</h2>

        {/* FROM */}
        <div style={styles.box}>
          <span style={styles.label}>From</span>
          <div style={styles.row}>
            <input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={styles.input}
            />
            <div style={styles.token}>SOL</div>
          </div>
        </div>

        {/* ARROW */}
        <div style={styles.arrow}>↓</div>

        {/* TO */}
        <div style={styles.box}>
          <span style={styles.label}>To</span>
          <div style={styles.row}>
            <input
              type="text"
              placeholder="Estimated"
              disabled
              style={styles.input}
            />
            <div style={styles.token}>USDC</div>
          </div>
        </div>

        {/* BUTTON */}
        <button style={styles.button} onClick={handleSwap}>
          {loading ? "Processing..." : "Swap"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#0f0f13",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#1a1b1f",
    padding: 20,
    borderRadius: 16,
    width: 360,
    boxShadow: "0 0 40px rgba(0,0,0,0.5)",
  },
  title: {
    color: "white",
    marginBottom: 20,
  },
  box: {
    background: "#2a2d35",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  label: {
    color: "#aaa",
    fontSize: 12,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "white",
    fontSize: 18,
    width: "70%",
  },
  token: {
    background: "#3a3f4b",
    padding: "6px 10px",
    borderRadius: 10,
    color: "white",
    fontWeight: "bold",
  },
  arrow: {
    textAlign: "center",
    color: "#888",
    margin: "10px 0",
  },
  button: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "none",
    background: "#6c5ce7",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    cursor: "pointer",
  },
};
