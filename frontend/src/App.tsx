import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/home";
import Index from "./routes/index/index.tsx";
import Login from "./routes/login/login";
import Signup from "./routes/signup/signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />}>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
