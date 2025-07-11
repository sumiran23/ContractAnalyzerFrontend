import styles from "../styles/ContractList.module.css";

interface Contract {
  id: string;
  filename: string;
  upload_time: string;
}

interface Props {
  contracts: Contract[];
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
}

const ContractList = ({ contracts, onDelete, onDownload }: Props) => (
  <div className={styles.list}>
    <h3>Your Contracts</h3>
    <ul>
      {contracts.map((c) => (
        <li key={c.id}>
          <span>{c.filename}</span>
          <span>{new Date(c.upload_time).toLocaleDateString()}</span>
          <button onClick={() => onDownload(c.id)}>Download</button>
          <button onClick={() => onDelete(c.id)}>Delete</button>
        </li>
      ))}
    </ul>
  </div>
);

export default ContractList;
