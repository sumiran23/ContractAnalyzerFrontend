import { useRef } from "react";
import styles from "../styles/ContractUpload.module.css";

interface Props {
  onUpload: (file: File) => void;
}

const ContractUpload = ({ onUpload }: Props) => {
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <form
      className={styles.uploadForm}
      onSubmit={(e) => {
        e.preventDefault();
        if (fileInput.current?.files?.[0]) {
          onUpload(fileInput.current.files[0]);
        }
      }}
    >
      <input type="file" ref={fileInput} required />
      <button type="submit">Upload Contract</button>
    </form>
  );
};

export default ContractUpload;
