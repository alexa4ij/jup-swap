import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
            const res = await fetch(`https://lite-api.jup.ag/price/v3?ids=${fromToken.id},${toToken.id}`);
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
        if (!amount)
            return;
        const fetchQuote = async () => {
            const lamports = Number(amount) * Math.pow(10, fromToken.decimals);
            const params = new URLSearchParams({
                inputMint: fromToken.id,
                outputMint: toToken.id,
                amount: lamports.toString(),
                slippageBps: slippage * 100,
            });
            const res = await fetch(`https://lite-api.jup.ag/ultra/v1/order?${params}`);
            const data = await res.json();
            if (data.outAmount) {
                const value = Number(data.outAmount) / Math.pow(10, toToken.decimals);
                setEstimated(value.toFixed(4));
            }
        };
        fetchQuote();
    }, [amount, fromToken, toToken, slippage]);
    // 🔥 SWAP
    const handleSwap = async () => {
        try {
            if (!wallet.connected)
                return alert("Connect wallet dulu");
            setLoading(true);
            const lamports = Number(amount) * Math.pow(10, fromToken.decimals);
            const params = new URLSearchParams({
                inputMint: fromToken.id,
                outputMint: toToken.id,
                amount: lamports.toString(),
                taker: wallet.publicKey.toBase58(),
            });
            const order = await fetch(`https://lite-api.jup.ag/ultra/v1/order?${params}`).then((r) => r.json());
            if (order.errorCode)
                throw new Error(order.errorMessage);
            const tx = VersionedTransaction.deserialize(Buffer.from(order.transaction, "base64"));
            const signedTx = await wallet.signTransaction(tx);
            const signedTxBase64 = Buffer.from(signedTx.serialize()).toString("base64");
            const result = await fetch("https://lite-api.jup.ag/ultra/v1/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    signedTransaction: signedTxBase64,
                    requestId: order.requestId,
                }),
            }).then((r) => r.json());
            alert(result.status === "Success"
                ? "✅ Swap berhasil"
                : "❌ Swap gagal");
        }
        catch (err) {
            alert(err.message);
        }
        finally {
            setLoading(false);
        }
    };
    const switchTokens = () => {
        setFromToken(toToken);
        setToToken(fromToken);
        setEstimated("");
    };
    return (_jsx("div", { style: styles.wrapper, children: _jsxs("div", { style: styles.card, children: [_jsx("h2", { style: styles.title, children: "\u26A1 Instant Swap" }), _jsxs("div", { style: styles.box, children: [_jsx("span", { style: styles.label, children: "From" }), _jsxs("div", { style: styles.row, children: [_jsx("input", { type: "number", placeholder: "0.0", value: amount, onChange: (e) => setAmount(e.target.value), style: styles.input }), _jsx(TokenSelector, { selected: fromToken, onSelect: setFromToken })] }), price && amount && (_jsxs("div", { style: styles.sub, children: ["\u2248 $", (amount * price.from).toFixed(2)] }))] }), _jsx("div", { style: styles.arrow, onClick: switchTokens, children: "\u21C5" }), _jsxs("div", { style: styles.box, children: [_jsx("span", { style: styles.label, children: "To (Estimated)" }), _jsxs("div", { style: styles.row, children: [_jsx("input", { type: "text", value: estimated, disabled: true, style: styles.input }), _jsx(TokenSelector, { selected: toToken, onSelect: setToToken })] }), price && estimated && (_jsxs("div", { style: styles.sub, children: ["\u2248 $", (estimated * price.to).toFixed(2)] }))] }), rate && (_jsxs("div", { style: styles.info, children: ["1 ", fromToken.symbol, " \u2248 ", rate, " ", toToken.symbol] })), _jsxs("div", { style: styles.info, children: ["Slippage: ", slippage, "%", _jsx("input", { type: "range", min: "0.1", max: "5", step: "0.1", value: slippage, onChange: (e) => setSlippage(e.target.value), style: { width: "100%" } })] }), _jsx("button", { style: styles.button, onClick: handleSwap, children: loading ? "Processing..." : "Swap" })] }) }));
}
const styles = {
    wrapper: {
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #1a1b1f, #0b0b0e)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        padding: 24,
        borderRadius: 20,
        width: 380,
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
    },
    input: {
        background: "transparent",
        border: "none",
        color: "white",
        width: "60%",
    },
    arrow: {
        textAlign: "center",
        cursor: "pointer",
        margin: 10,
        color: "#aaa",
    },
    sub: {
        color: "#888",
        fontSize: 12,
        marginTop: 4,
    },
    info: {
        color: "#aaa",
        fontSize: 12,
        marginTop: 8,
    },
    button: {
        width: "100%",
        padding: 14,
        borderRadius: 12,
        background: "#6c5ce7",
        color: "white",
        border: "none",
        marginTop: 10,
    },
};
