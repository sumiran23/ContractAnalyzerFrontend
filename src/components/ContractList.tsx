import styles from "../styles/ContractList.module.css";

interface Contract {
  _id: string;
  originalname: string;
  uploadDate: string;
}

interface Props {
  contracts: Contract[];
  onDelete: (id: string) => void;
}

const ContractList = ({ contracts, onDelete }: Props) => (
  <div className={styles.list}>
    <h3>Your Contracts</h3>
    <ul>
      {contracts.map((c) => (
        <li key={c._id}>
          <span>{c.originalname}</span>
          <span>{new Date(c.uploadDate).toLocaleDateString()}</span>
          <button onClick={() => onDelete(c._id)}>Delete</button>
        </li>
      ))}
    </ul>
  </div>
);

export default ContractList;
