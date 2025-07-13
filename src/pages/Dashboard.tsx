import { useState } from "react";
import ContractUpload from "../components/ContractUpload";
import ContractList from "../components/ContractList";
import axios from "../services/customAxios";
import { toast } from "react-toastify";
import { useEffect } from "react";

// Simple modal spinner component
const ProcessingModal = ({ open }: { open: boolean }) =>
  open ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem 3rem",
          borderRadius: 10,
          boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          className="spinner"
          style={{
            border: "4px solid #e2e8f0",
            borderTop: "4px solid #3182ce",
            borderRadius: "50%",
            width: 40,
            height: 40,
            animation: "spin 1s linear infinite",
            marginBottom: 16,
          }}
        />
        <span>Processing document...</span>
        <style>
          {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
        </style>
      </div>
    </div>
  ) : null;

const Dashboard = () => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [fetchDocumentsList, setFetchDocumentsList] = useState<Boolean>(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (fetchDocumentsList) {
      const fetchContracts = async () => {
        try {
          const response = await axios.get("/documents/list");
          setContracts(response.data);
        } catch (error) {
          console.error("Failed to fetch contracts:", error);
        } finally {
          setFetchDocumentsList(false);
        }
      };
      fetchContracts();
    }
  }, [fetchDocumentsList]);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    setProcessing(true);
    try {
      const response = await axios.post("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFetchDocumentsList(true);
      toast.success("File upload successful!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("File upload failed!");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = (id: string) => {
    // TODO: Implement contract delete logic (API call, update list)
  };

  const handleDownload = async (id: string) => {
    // TODO: Implement contract delete logic (API call, update list)
    try {
      const response = await axios.get(`/documents/download/${id}`, {
        responseType: "blob",
      });

      // Try to get the original filename from the response data if available
      let filename = "downloaded_file";
      // If your contract object has the original filename, find it from contracts state
      const contract = contracts.find((c) => c.id === id);
      if (contract && contract.filename) {
        filename = contract.filename;
      } else {
        const contentDisposition = response.headers["content-disposition"];
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match && match[1]) {
            filename = match[1];
          }
        } else if (response.data && response.data.type) {
          // Fallback: try to infer extension from content type
          const mimeType = response.data.type;
          const extMap: Record<string, string> = {
            "application/pdf": "pdf",
            "text/plain": "txt",
            "application/msword": "doc",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
              "docx",
          };
          const ext = extMap[mimeType] || "";
          if (ext) filename += `.${ext}`;
        }
      }

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: response.data.type })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("File download started!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("File download failed!");
    }
  };

  return (
    <div>
      <ProcessingModal open={processing} />
      <ContractUpload onUpload={handleUpload} />
      <ContractList
        contracts={contracts}
        onDelete={handleDelete}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default Dashboard;
