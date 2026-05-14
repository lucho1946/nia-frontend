import { useState, useRef, useEffect } from "react";

const API_URL = "http://127.0.0.1:8000";

const HexIcon = ({ size = 40, letter = "N", fontSize = 16 }) => (
  <div style={{ width: size, height: size, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg style={{ position: "absolute", inset: 0, width: size, height: size }} viewBox="0 0 40 40">
      <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="#F5C400" />
    </svg>
    <span style={{ position: "relative", zIndex: 1, fontSize, fontWeight: 500, color: "#1a0f00" }}>{letter}</span>
  </div>
);

const TypingIndicator = () => (
  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
    <HexIcon size={30} fontSize={11} />
    <div style={{ padding: "13px 17px", background: "#171717", borderRadius: "4px 16px 16px 16px", border: "0.5px solid #222", display: "flex", gap: 5, alignItems: "center" }}>
      {[0, 200, 400].map((delay, i) => (
        <div key={i} style={{
          width: 6, height: 6, background: "#2a2a2a", borderRadius: "50%",
          animation: "tp 1.2s infinite", animationDelay: `${delay}ms`
        }} />
      ))}
    </div>
  </div>
);

const ProductCard = ({ product, onCotizar }) => (
  <div style={{ background: "#151515", border: "0.5px solid #222", borderLeft: "3px solid #F5C400", borderRadius: "0 16px 16px 0", overflow: "hidden", marginLeft: 40, maxWidth: "76%" }}>
    <div style={{ padding: "16px 18px" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#191500", color: "#F5C400", border: "0.5px solid #2e2200", borderRadius: 6, fontSize: 10, padding: "3px 9px", marginBottom: 10, letterSpacing: "0.4px" }}>
        ★ Recomendado
      </div>
      <div style={{ fontSize: 15, fontWeight: 500, color: "#f0f0f0", marginBottom: 4, lineHeight: 1.3 }}>{product.nombre}</div>
      <div style={{ fontSize: 11, color: "#444", marginBottom: 12 }}>{product.marca} · Ref: {product.referencia}</div>
      {product.caracteristicas?.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {product.caracteristicas.slice(0, 4).map((c, i) => (
            <div key={i} style={{ background: "#111", border: "0.5px solid #1e1e1e", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#555" }}>
              {c.titulo ? `${c.titulo}: ${c.valor}` : c.valor}
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <div style={{ fontSize: 22, fontWeight: 500, color: "#F5C400" }}>{product.precio}</div>
      </div>
      {product.disponibilidad && (
        <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>{product.disponibilidad}</div>
      )}
      {product.tiempo_entrega && (
        <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>Entrega: {product.tiempo_entrega}</div>
      )}
    </div>
    <div style={{ borderTop: "0.5px solid #1a1a1a", padding: "12px 18px", display: "flex", gap: 8 }}>
      <button
        onClick={() => onCotizar(product)}
        style={{ flex: 1.4, border: "none", background: "#F5C400", color: "#1a0f00", borderRadius: 10, padding: 10, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
        Solicitar cotización
      </button>
    </div>
  </div>
);

const Message = ({ msg, onCotizar }) => {
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexDirection: isUser ? "row-reverse" : "row" }}>
        {!isUser && <HexIcon size={30} fontSize={11} />}
        {isUser && (
          <div style={{ width: 30, height: 30, background: "#1e1e1e", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#555", flexShrink: 0 }}>U</div>
        )}
        <div style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", gap: 3 }}>
          <div style={{
            padding: "12px 16px", fontSize: 13, lineHeight: 1.7, maxWidth: "74%",
            background: isUser ? "#F5C400" : "#171717",
            color: isUser ? "#1a0f00" : "#ccc",
            borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
            border: isUser ? "none" : "0.5px solid #222"
          }}>
            {msg.content}
          </div>
          <div style={{ fontSize: 10, color: "#2e2e2e", padding: "0 2px" }}>{msg.time}</div>
        </div>
      </div>
      {msg.productos?.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {msg.productos.slice(0, 3).map((p, i) => (
            <ProductCard key={i} product={p} onCotizar={onCotizar} />
          ))}
        </div>
      )}
      {msg.requiere_accion === "escalar_asesor" && (
        <div style={{ background: "#131313", border: "0.5px solid #1e1e1e", borderRadius: 14, padding: "14px 16px", marginLeft: 40, maxWidth: "76%", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#ddd" }}>Conectar con asesor</div>
            <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>Un asesor te responde en menos de 30 minutos</div>
          </div>
          <button style={{ background: "#F5C400", color: "#1a0f00", border: "none", borderRadius: 10, padding: "9px 16px", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
            Contactar
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const bottomRef = useRef(null);

  const now = () => new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text, time: now() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: text, session_id: sessionId, canal: "web", cliente_id: "anonimo" })
      });
      const data = await res.json();
      if (data.session_id) setSessionId(data.session_id);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.respuesta,
        productos: data.productos || [],
        requiere_accion: data.requiere_accion,
        time: now()
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Error conectando con NIA. Verifica que el servidor esté activo.", time: now() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCotizar = (product) => {
    sendMessage(`Quiero cotizar: ${product.nombre} (Código: ${product.codigo})`);
  };

  const chips = ["Válvulas neumáticas", "Rodamientos", "Bombas", "Sensores", "Cables"];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        @keyframes tp { 0%,60%,100%{opacity:.3;transform:translateY(0)} 30%{opacity:1;transform:translateY(-2px)} }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
        input::placeholder { color: #333; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 480, height: "100vh", maxHeight: 760, background: "#0d0d0d", borderRadius: 20, overflow: "hidden", border: "0.5px solid #222", display: "flex", flexDirection: "column" }}>

        {/* NAV */}
        <div style={{ height: 66, background: "#111", borderBottom: "0.5px solid #1e1e1e", display: "flex", alignItems: "center", padding: "0 20px", gap: 14, flexShrink: 0 }}>
          <HexIcon size={40} fontSize={16} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: "#f0f0f0" }}>NIA</div>
            <div style={{ fontSize: 11, color: "#22c55e", display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <div style={{ width: 5, height: 5, background: "#22c55e", borderRadius: "50%" }} />
              Disponible ahora
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#383838" }}>VIA Industrial</div>
        </div>

        {/* CHAT */}
        <div style={{ flex: 1, padding: "22px 18px", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto", background: "#111", position: "relative" }}>

          {/* WELCOME */}
          {messages.length === 0 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "8px 0 4px" }}>
              <HexIcon size={62} letter="N" fontSize={22} />
              <div style={{ fontSize: 18, fontWeight: 500, color: "#f0f0f0" }}>Hola, soy NIA</div>
              <div style={{ fontSize: 13, color: "#555", textAlign: "center", maxWidth: 270, lineHeight: 1.65 }}>
                Asesora comercial de VIA Industrial. Cuéntame qué producto necesitas.
              </div>
              <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                {chips.map(chip => (
                  <button key={chip} onClick={() => sendMessage(chip)}
                    style={{ border: "0.5px solid #252525", background: "#161616", color: "#777", borderRadius: 12, padding: "8px 14px", fontSize: 12, cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.target.style.borderColor = "#F5C400"; e.target.style.color = "#F5C400"; e.target.style.background = "#191500"; }}
                    onMouseLeave={e => { e.target.style.borderColor = "#252525"; e.target.style.color = "#777"; e.target.style.background = "#161616"; }}>
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MESSAGES */}
          {messages.map((msg, i) => (
            <Message key={i} msg={msg} onCotizar={handleCotizar} />
          ))}

          {/* TYPING */}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* INPUT BAR */}
        <div style={{ background: "#0d0d0d", borderTop: "0.5px solid #181818", padding: "14px 18px", display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage(input)}
            placeholder="Escribe el producto que necesitas..."
            style={{ flex: 1, background: "#141414", border: "0.5px solid #222", borderRadius: 14, padding: "12px 18px", fontSize: 13, color: "#ccc", outline: "none", transition: "border-color 0.2s", fontFamily: "inherit" }}
            onFocus={e => e.target.style.borderColor = "#F5C400"}
            onBlur={e => e.target.style.borderColor = "#222"}
          />
          <button onClick={() => sendMessage(input)}
            style={{ width: 44, height: 44, background: "#F5C400", border: "none", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#e6b800"; e.currentTarget.style.borderRadius = "16px"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#F5C400"; e.currentTarget.style.borderRadius = "12px"; }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a0f00">
              <path d="M2 21L23 12 2 3v7l15 2-15 2v7z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}