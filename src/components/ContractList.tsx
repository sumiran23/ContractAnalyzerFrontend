import { useState, useRef, useEffect } from "react";
import styles from "../styles/ContractList.module.css";
import axios from "../services/customAxios";
import { toast } from "react-toastify";

interface Contract {
  id: string;
  filename: string;
  upload_time: string;
  summary?: string;
  section_titles?: string[];
}

interface Props {
  contracts: Contract[];
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
}

const ContractList = ({ contracts, onDelete, onDownload }: Props) => {
  const [openSection, setOpenSection] = useState<{
    contractId: string;
    sectionTitle: string;
    text?: string;
    loading: boolean;
    error?: string;
  } | null>(null);
  const [openChat, setOpenChat] = useState<{
    contractId: string;
    loading: boolean;
    history: { role: string; message: string }[];
    error?: string;
  } | null>(null);
  const [chatInput, setChatInput] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const chatHistoryRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom when chat history changes
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [openChat?.history?.length]);

  const handleViewSection = async (
    contractId: string,
    sectionTitle: string
  ) => {
    setOpenSection({
      contractId,
      sectionTitle,
      loading: true,
      text: "",
      error: undefined,
    });
    try {
      const res = await axios.get(
        `/documents/section-info/${contractId}?section=${encodeURIComponent(
          sectionTitle
        )}`
      );
      setOpenSection({
        contractId,
        sectionTitle,
        text: res.data.data || "No text found for this section.",
        loading: false,
        error: undefined,
      });
    } catch (err) {
      setOpenSection({
        contractId,
        sectionTitle,
        text: "",
        loading: false,
        error: "Failed to fetch section text.",
      });
      toast.error("Failed to fetch section text.");
    }
  };

  const handleOpenChat = async (contractId: string) => {
    setOpenChat({
      contractId,
      loading: true,
      history: [],
      error: undefined,
    });
    try {
      const res = await axios.get(`/documents/conversation/${contractId}`);
      setOpenChat({
        contractId,
        loading: false,
        history: res.data.chats || [],
        error: undefined,
      });
    } catch (err) {
      setOpenChat({
        contractId,
        loading: false,
        history: [],
        error: "Failed to fetch chat history.",
      });
      toast.error("Failed to fetch chat history.");
    }
  };

  const handleSendChat = async () => {
    if (!openChat || !chatInput.trim()) return;
    setSending(true);
    try {
      // Optimistically update chat history
      setOpenChat((prev) =>
        prev
          ? {
              ...prev,
              history: [
                ...prev.history,
                { role: "user", message: chatInput.trim() },
              ],
            }
          : prev
      );
      setChatInput("");
      const res = await axios.post(`/documents/chat/${openChat.contractId}`, {
        query: chatInput.trim(),
      });
      setOpenChat((prev) =>
        prev
          ? {
              ...prev,
              history: [
                ...prev.history,
                { role: "bot", message: res.data.answer || "No response." },
              ],
            }
          : prev
      );
    } catch (err) {
      toast.error("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleCloseSection = () => setOpenSection(null);
  const handleCloseChat = () => setOpenChat(null);

  return (
    <div className={styles.list}>
      <h3>Your Contracts</h3>
      <ul>
        {contracts.map((c) => (
          <li key={c.id} className={styles.contractCard}>
            {/* First row: filename, date, actions, sections */}
            <div className={styles.contractRow}>
              <div className={styles.contractInfo}>
                <span className={styles.contractName}>{c.filename}</span>
                <span className={styles.contractDate}>
                  {new Date(c.upload_time).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.actions}>
                <button onClick={() => onDownload(c.id)}>Download</button>
                <button onClick={() => onDelete(c.id)}>Delete</button>
                <button onClick={() => handleOpenChat(c.id)}>Chat</button>
              </div>
            </div>
            {/* Second row: summary and sections */}
            <div className={styles.contractRow}>
              <div className={styles.summaryAndSections}>
                {c.summary && (
                  <p className={styles.summary}>
                    <strong>Summary:</strong> {c.summary}
                  </p>
                )}
                {c.section_titles && c.section_titles.length > 0 && (
                  <div className={styles.sections}>
                    <strong>Sections:</strong>
                    <div className={styles.sectionChips}>
                      {c.section_titles.map((title) => (
                        <button
                          key={title}
                          className={styles.sectionChip}
                          onClick={() => handleViewSection(c.id, title)}
                        >
                          {title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {/* Section Modal */}
      {openSection && (
        <div
          className={styles.sectionModalBackdrop}
          onClick={handleCloseSection}
        >
          <div
            className={styles.sectionModal}
            onClick={(e) => e.stopPropagation()}
          >
            <h4>{openSection.sectionTitle}</h4>
            {openSection.loading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minHeight: 80,
                }}
              >
                <div
                  style={{
                    border: "4px solid #e2e8f0",
                    borderTop: "4px solid #3182ce",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    animation: "spin 1s linear infinite",
                    marginBottom: 12,
                  }}
                />
                <span>Loading section...</span>
                <style>
                  {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
                </style>
              </div>
            ) : openSection.error ? (
              <div style={{ color: "red" }}>{openSection.error}</div>
            ) : (
              <div style={{ whiteSpace: "pre-wrap" }}>{openSection.text}</div>
            )}
            <button onClick={handleCloseSection} style={{ marginTop: 16 }}>
              Close
            </button>
          </div>
        </div>
      )}
      {/* Chat Modal */}
      {openChat && (
        <div className={styles.sectionModalBackdrop} onClick={handleCloseChat}>
          <div
            className={styles.sectionModal}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 600, width: "95vw" }}
          >
            <h4>Chat with Document</h4>
            {openChat.loading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minHeight: 80,
                }}
              >
                <div
                  style={{
                    border: "4px solid #e2e8f0",
                    borderTop: "4px solid #3182ce",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    animation: "spin 1s linear infinite",
                    marginBottom: 12,
                  }}
                />
                <span>Loading chat history...</span>
                <style>
                  {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
                </style>
              </div>
            ) : openChat.error ? (
              <div style={{ color: "red" }}>{openChat.error}</div>
            ) : (
              <>
                <div className={styles.chatHistory} ref={chatHistoryRef}>
                  {openChat.history.length === 0 ? (
                    <div style={{ color: "#888" }}>No conversation yet.</div>
                  ) : (
                    openChat.history.map((msg, idx) => (
                      <div
                        key={idx}
                        className={
                          msg.role === "user"
                            ? styles.chatUserMsg
                            : styles.chatBotMsg
                        }
                      >
                        <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>{" "}
                        {msg.message}
                      </div>
                    ))
                  )}
                </div>
                <div className={styles.chatInputRow}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask a question about this document..."
                    disabled={sending}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendChat();
                    }}
                  />
                  <button
                    onClick={handleSendChat}
                    disabled={sending || !chatInput.trim()}
                  >
                    {sending ? "Sending..." : "Send"}
                  </button>
                </div>
              </>
            )}
            <button onClick={handleCloseChat} style={{ marginTop: 16 }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractList;
