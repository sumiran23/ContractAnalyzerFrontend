import { useState } from "react";
import ContractUpload from "../components/ContractUpload";
import ContractList from "../components/ContractList";

const Dashboard = () => {
  const [contracts, setContracts] = useState<any[]>([]);

  const handleUpload = (file: File) => {
    // TODO: Implement contract upload logic (API call, update list)
  };

  const handleDelete = (id: string) => {
    // TODO: Implement contract delete logic (API call, update list)
  };

  return (
    <div>
      <ContractUpload onUpload={handleUpload} />
      <ContractList contracts={contracts} onDelete={handleDelete} />
    </div>
  );
};

export default Dashboard;
