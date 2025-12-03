import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export default function ChatBox() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi! Ask me anything about your flight or trip." }
    ]);
    const [input, setInput] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState(null);
    const scrollerRef = useRef(null);

    useEffect(() => {
        if (scrollerRef.current) {
            scrollerRef.current.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [messages, open, pending]);

    async function send(e) {
        e.preventDefault();
        if (!input.trim() || pending) return;

        const userMsg = { role: "user", content: input.trim() };
        setMessages((m) => [...m, userMsg]);
        setInput("");
        setPending(true);
        setError(null);

        try {
            const res = await fetch(`${API_BASE}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMsg] })
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error || `Request failed: ${res.status}`);
            }
            const data = await res.json();
            const reply = data.reply || "Sorry, I didn’t catch that.";
            setMessages((m) => [...m, { role: "assistant", content: reply }]);
        } catch (err) {
            setError(err.message || "Network error");
            // show a visible assistant bubble with the error so the UI isn’t “dead”
            setMessages((m) => [
                ...m,
                { role: "assistant", content: "⚠️ I couldn’t reach the chat service. Check the server and try again." }
            ]);
        } finally {
            setPending(false);
        }
    }

    function reset() {
        setMessages([{ role: "assistant", content: "Hi! Ask me anything about your flight or trip." }]);
        setError(null);
    }

    return createPortal(
        <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 2147483647, pointerEvents: "auto" }}>
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    style={{ padding: "10px 14px", borderRadius: 999, border: "1px solid #e5e7eb", background: "#111827", color: "#fff" }}
                >
                    Chat
                </button>
            )}

            {open && (
                <div
                    style={{
                        width: 360,
                        height: 480,
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 12,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden"
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            padding: "10px 12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: "#111827",
                            color: "#fff"
                        }}
                    >
                        <strong>Trip Assistant</strong>
                        <div>
                            <button onClick={reset} title="Reset" style={{ marginRight: 8, background: "transparent", color: "#fff" }}>
                                ↺
                            </button>
                            <button onClick={() => setOpen(false)} title="Close" style={{ background: "transparent", color: "#fff" }}>
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div ref={scrollerRef} style={{ flex: 1, padding: 12, overflowY: "auto", background: "#f9fafb" }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{ textAlign: m.role === "user" ? "right" : "left", margin: "6px 0" }}>
                <span
                    style={{
                        display: "inline-block",
                        padding: "8px 10px",
                        borderRadius: 10,
                        maxWidth: "85%",
                        background: m.role === "user" ? "#111827" : "#e5e7eb",
                        color: m.role === "user" ? "#fff" : "#111827",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word"
                    }}
                >
                  {m.content}
                </span>
                            </div>
                        ))}
                        {pending && (
                            <div style={{ textAlign: "left", margin: "6px 0" }}>
                <span style={{ display: "inline-block", padding: "8px 10px", borderRadius: 10, background: "#e5e7eb" }}>
                  …thinking
                </span>
                            </div>
                        )}
                    </div>

                    {/* Error bar */}
                    {error && (
                        <div style={{ color: "#b91c1c", background: "#fee2e2", padding: "6px 10px", fontSize: 12 }}>
                            {error}
                        </div>
                    )}

                    {/* Input */}
                    <form onSubmit={send} style={{ display: "flex", padding: 10, gap: 8, borderTop: "1px solid #e5e7eb" }}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about flights, delays, tips…"
                            disabled={pending}
                            style={{
                                flex: 1,
                                border: "1px solid #e5e7eb",
                                borderRadius: 8,
                                padding: "10px 12px",
                                outline: "none"
                            }}
                        />
                        <button
                            type="submit"
                            disabled={pending || !input.trim()}
                            style={{
                                padding: "10px 14px",
                                borderRadius: 8,
                                border: "1px solid #e5e7eb",
                                background: pending ? "#e5e7eb" : "#111827",
                                color: pending ? "#6b7280" : "#fff",
                                cursor: pending ? "not-allowed" : "pointer"
                            }}
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}
        </div>,
        document.body
    );
}
