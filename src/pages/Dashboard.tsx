import { useState } from "react";
import ContractUpload from "../components/ContractUpload";
import ContractList from "../components/ContractList";
import axios from "../services/customAxios";
import { toast } from "react-toastify";
import { useEffect } from "react";

const Dashboard = () => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [fetchDocumentsList, setFetchDocumentsList] = useState<Boolean>(true);

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
    // TODO: Implement contract upload logic (API call, update list)
    const formData = new FormData();
    formData.append("file", file);

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
