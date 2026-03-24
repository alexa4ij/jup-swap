import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Swap from "./Swap";
export default function App() {
    return (_jsxs("div", { style: { padding: 20 }, children: [_jsx("h1", { children: "\uD83D\uDE80 Simple Jupiter DEX" }), _jsx(WalletMultiButton, {}), _jsx(Swap, {})] }));
}
