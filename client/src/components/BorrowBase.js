import { useEffect, useState } from 'react';
import axios from "axios";
const serverAddress = "http://localhost:5000"

function BorrowBase() {
  const [borrowBase, setBorrowBase] = useState(null);
  useEffect(() => {
    async function getBorrowBase() {
      try {
        const fullInfoResponse = await axios.get(
          `${serverAddress}/api/borrowbase`);
        setBorrowBase(fullInfoResponse.data);
    } catch (error) {
        console.error("Error fetching")
    };
  }
  getBorrowBase();
}, []);

return (
    <nav className="borrow_base">
      {JSON.stringify(borrowBase)}
    </nav>
);
}

export default BorrowBase;

