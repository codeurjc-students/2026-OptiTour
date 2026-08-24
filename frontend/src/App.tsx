import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./routes/home";
import Index from "./routes/index";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />}>
          <Route path="/" element={<Index />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
