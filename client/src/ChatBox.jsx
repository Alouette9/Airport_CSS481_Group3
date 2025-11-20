import { useEffect, useRef, useState } from "react";

export default function ChatBox() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me anything about your flight or trip." }
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollerRef = useRef(null);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTo({
        top: scrollerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, open]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim() || pending) return;

    const next = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");
    setPending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `⚠️ ${err.message}` }
      ]);
    } finally {
      setPending(false);
    }
  }

  function handleReset() {
    setMessages([{ role: "assistant", content: "Chat reset. How can I help?" }]);
    setInput("");
  }

  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 9999,
        fontFamily: "inherit"
      }}
    >
      {/* Closed state: just a round button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            borderRadius: "999px",
            padding: "10px 16px",
            border: "none",
            background: "#111827",
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 6px 16px rgba(0,0,0,0.25)"
          }}
        >
          Chat 💬
        </button>
      )}

      {/* Open state: small chat window */}
      {open && (
        <div
          style={{
            width: 320,
            height: 380,
            background: "#ffffff",
            borderRadius: 16,
            boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "8px 12px",
              background: "#111827",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600 }}>Flight Chat</span>
            <button
              onClick={() => setOpen(false)}
              style={{
                border: "none",
                background: "transparent",
                color: "#e5e7eb",
                cursor: "pointer",
                fontSize: 16
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollerRef}
            style={{
              flex: 1,
              padding: 8,
              overflowY: "auto",
              background: "#f9fafb"
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  textAlign: m.role === "user" ? "right" : "left",
                  margin: "4px 0"
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    background: m.role === "user" ? "#111827" : "#e5e7eb",
                    color: m.role === "user" ? "#fff" : "#111827",
                    padding: "6px 10px",
                    borderRadius: 14,
                    fontSize: 12,
                    maxWidth: "80%",
                    whiteSpace: "pre-wrap"
                  }}
                >
                  {m.content}
                </span>
              </div>
            ))}
            {pending && (
              <div
                style={{
                  opacity: 0.7,
                  fontStyle: "italic",
                  fontSize: 12,
                  marginTop: 4
                }}
              >
                AI is typing…
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            style={{
              borderTop: "1px solid #e5e7eb",
              padding: 6,
              display: "flex",
              gap: 4
            }}
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about your flight..."
              style={{
                flex: 1,
                borderRadius: 999,
                border: "1px solid #d1d5db",
                padding: "6px 10px",
                fontSize: 12
              }}
            />
            <button
              type="submit"
              disabled={pending}
              style={{
                borderRadius: 999,
                border: "none",
                background: pending ? "#9ca3af" : "#111827",
                color: "#fff",
                padding: "6px 10px",
                fontSize: 12,
                cursor: pending ? "default" : "pointer"
              }}
            >
              Send
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={{
                borderRadius: 999,
                border: "none",
                background: "#e5e7eb",
                color: "#111827",
                padding: "6px 10px",
                fontSize: 12,
                cursor: "pointer"
              }}
            >
              ↺
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
