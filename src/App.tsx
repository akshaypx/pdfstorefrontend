import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Layout from "./components/Layout";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            index
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/upload"
            element={
              <Layout>
                <Upload />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
