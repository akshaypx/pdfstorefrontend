import { useEffect, useState } from "react";
import Header from "./components/Header";
import { AllPDFFilesData } from "./interfaces";

const BASE_URL = "http://localhost:8000";

const App = () => {
  const [allPdfs, setAllPdfs] = useState<AllPDFFilesData | null>(null);

  const fetchAllPdfs = () => {
    fetch(BASE_URL + "/all-pdf")
      .then(async (res) => await res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchAllPdfs();
  }, []);
  return <Header />;
};

export default App;
