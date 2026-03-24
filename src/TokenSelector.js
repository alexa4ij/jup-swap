import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
export default function TokenSelector({ onSelect, selected }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [tokens, setTokens] = useState([]);
    useEffect(() => {
        if (!open)
            return;
        const fetchTokens = async () => {
            const res = await fetch(`https://lite-api.jup.ag/tokens/v2/search?query=${query}`);
            const data = await res.json();
            setTokens(data);
        };
        fetchTokens();
    }, [query, open]);
    return (_jsxs(_Fragment, { children: [_jsx("div", { style: styles.button, onClick: () => setOpen(true), children: selected?.symbol || "Select" }), open && (_jsx("div", { style: styles.modal, children: _jsxs("div", { style: styles.card, children: [_jsx("input", { placeholder: "Search token...", value: query, onChange: (e) => setQuery(e.target.value), style: styles.search }), _jsx("div", { style: styles.list, children: tokens.map((t) => (_jsxs("div", { style: styles.item, onClick: () => {
                                    onSelect(t);
                                    setOpen(false);
                                }, children: [_jsx("img", { src: t.icon, alt: "", style: styles.icon }), _jsxs("div", { children: [_jsx("div", { children: t.symbol }), _jsx("small", { children: t.name })] })] }, t.id))) }), _jsx("button", { onClick: () => setOpen(false), children: "Close" })] }) }))] }));
}
const styles = {
    button: {
        background: "#3a3f4b",
        padding: "6px 10px",
        borderRadius: 10,
        color: "white",
        cursor: "pointer",
    },
    modal: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        background: "#1a1b1f",
        padding: 20,
        borderRadius: 12,
        width: 350,
    },
    search: {
        width: "100%",
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
        border: "none",
    },
    list: {
        maxHeight: 300,
        overflow: "auto",
    },
    item: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: 10,
        cursor: "pointer",
        color: "white",
    },
    icon: {
        width: 24,
        height: 24,
    },
};
