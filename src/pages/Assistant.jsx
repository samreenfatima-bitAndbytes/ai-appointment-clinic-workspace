import { useRef, useState } from "react";
import { replyFromDocs } from "../data/seed";
import { useStore } from "../hooks/useStore";

export default function Assistant() {
  const { documents, addDocument, removeDocument } = useStore();
  const fileRef = useRef(null);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! Ask about clinic hours, booking, or cancellations." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const send = (text) => {
    const msg = String(text || "").trim();
    if (!msg || busy) return;
    setBusy(true);
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setInput("");
    window.setTimeout(() => {
      setMessages((m) => [
        ...m,
        { role: "bot", text: replyFromDocs(msg, documents) },
      ]);
      setBusy(false);
    }, 400);
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addDocument({ filename: file.name, content: await file.text() });
    e.target.value = "";
  };

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Assistant</h2>
          <p className="muted" style={{ margin: "0.35rem 0 0" }}>
            FAQ chat from clinic documents (simulated AI)
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => fileRef.current?.click()}
        >
          Upload .txt
        </button>
        <input ref={fileRef} type="file" accept=".txt,text/plain" hidden onChange={onFile} />
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="messages">
            {messages.map((m, i) => (
              <div key={i} className={`bubble ${m.role}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="suggestions">
            {["What are your hours?", "How do I book?", "Virtual visits?"].map((s) => (
              <button key={s} type="button" onClick={() => send(s)} disabled={busy}>
                {s}
              </button>
            ))}
          </div>
          <form
            className="composer"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              disabled={busy}
            />
            <button className="btn btn-primary" type="submit" disabled={busy}>
              Send
            </button>
          </form>
        </div>
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Knowledge docs</h3>
          <ul className="stack-list">
            {documents.map((d) => (
              <li key={d.id} className="stack-item">
                <div className="stack-item-body">
                  <strong>{d.filename}</strong>
                  <p>{String(d.content).slice(0, 90)}…</p>
                </div>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeDocument(d.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
