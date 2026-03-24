import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";
import TokenSelector from "./TokenSelector";
import { Buffer } from "buffer";

window.Buffer = Buffer;

export default function Swap() {
  const wallet = useWallet();

  const [fromToken, setFromToken] = useState({
    symbol: "SOL",
    id: "So11111111111111111111111111111111111111112",
    decimals: 9,
  });

  const [toToken, setToToken] = useState({
    symbol: "USDC",
    id: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimals: 6,
  });

  const [amount, setAmount] = useState("");
  const [estimated, setEstimated] = useState("");
  const [loading, setLoading] = useState(false);

  const [price, setPrice] = useState(null);
  const [rate, setRate] = useState(null);
  const [slippage, setSlippage] = useState(0.5);

  // 💰 PRICE USD
  useEffect(() => {
    const fetchPrice = async () => {
      const res = await fetch(
        `https://lite-api.jup.ag/price/v3?ids=${fromToken.id},${toToken.id}`
      );
      const data = await res.json();

      const p1 = data[fromToken.id]?.usdPrice;
      const p2 = data[toToken.id]?.usdPrice;

      if (p1 && p2) {
        setPrice({ from: p1, to: p2 });
        setRate((p1 / p2).toFixed(4));
      }
    };

    fetchPrice();
  }, [fromToken, toToken]);

  // 🔥 AUTO QUOTE
  useEffect(() => {
    if (!amount) return;

    const fetchQuote = async () => {
      const lamports = Number(amount) * Math.pow(10, fromToken.decimals);

      const params = new URLSearchParams({
        inputMint: fromToken.id,
        outputMint: toToken.id,
        amount: lamports.toString(),
        slippageBps: slippage * 100,
      });

      const res = await fetch(
        `https://lite-api.jup.ag/ultra/v1/order?${params}`
      );
      const data = await res.json();

      if (data.outAmount) {
        const value =
          Number(data.outAmount) / Math.pow(10, toToken.decimals);
        setEstimated(value.toFixed(4));
      }
    };

    fetchQuote();
  }, [amount, fromToken, toToken, slippage]);

  // 🔥 SWAP
  const handleSwap = async () => {
    try {
      if (!wallet.connected) return alert("Connect wallet dulu");

      setLoading(true);

      const lamports = Number(amount) * Math.pow(10, fromToken.decimals);

      const params = new URLSearchParams({
        inputMint: fromToken.id,
        outputMint: toToken.id,
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

      alert(
        result.status === "Success"
          ? "✅ Swap berhasil"
          : "❌ Swap gagal"
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setEstimated("");
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>⚡ Instant Swap</h2>

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
            <TokenSelector selected={fromToken} onSelect={setFromToken} />
          </div>

          {price && amount && (
            <div style={styles.sub}>
              ≈ ${(amount * price.from).toFixed(2)}
            </div>
          )}
        </div>

        {/* SWITCH */}
        <div style={styles.arrow} onClick={switchTokens}>
          ⇅
        </div>

        {/* TO */}
        <div style={styles.box}>
          <span style={styles.label}>To (Estimated)</span>

          <div style={styles.row}>
            <input
              type="text"
              value={estimated}
              disabled
              style={styles.input}
            />
            <TokenSelector selected={toToken} onSelect={setToToken} />
          </div>

          {price && estimated && (
            <div style={styles.sub}>
              ≈ ${(estimated * price.to).toFixed(2)}
            </div>
          )}
        </div>

        {/* INFO */}
        {rate && (
          <div style={styles.info}>
            1 {fromToken.symbol} ≈ {rate} {toToken.symbol}
          </div>
        )}

        {/* SLIPPAGE */}
        <div style={styles.info}>
          Slippage: {slippage}%
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={slippage}
            onChange={(e) => setSlippage(e.target.value)}
            style={{ width: "100%" }}
          />
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
        background: "radial-gradient(circle at top, #0a0b0f, #050506)", // gelap deep space
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        background: "rgba(20,22,28,0.9)", // gelap semi-transparent
        backdropFilter: "blur(30px)",
        padding: 24,
        borderRadius: 20,
        width: 380,
        boxShadow: "0 0 20px rgba(0,255,200,0.2)", // glow neon
    },
    title: {
        color: "#00fff7", // biru-toska neon
        marginBottom: 20,
        fontWeight: 600,
        fontSize: 22,
    },
    box: {
        background: "#12141b", // gelap kontras
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
        border: "1px solid #00fff7", // outline neon
    },
    label: {
        color: "#7f8c9a", // abu neon soft
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
        color: "white",
        width: "60%",
        fontWeight: 500,
    },
    arrow: {
        textAlign: "center",
        cursor: "pointer",
        margin: 10,
        color: "#00fff7", // neon accent
    },
    sub: {
        color: "#7f8c9a",
        fontSize: 12,
        marginTop: 4,
    },
    info: {
        color: "#00fff7",
        fontSize: 12,
        marginTop: 8,
    },
    button: {
        width: "100%",
        padding: 14,
        borderRadius: 12,
        background: "linear-gradient(90deg, #6c5ce7, #00fff7)", // gradasi neon ungu-biru
        color: "white",
        border: "none",
        marginTop: 10,
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(0,255,247,0.3)", // glow effect
        transition: "0.3s ease",
    },
};
