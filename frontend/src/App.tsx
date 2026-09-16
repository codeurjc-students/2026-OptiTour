import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/home";
import Index from "./routes/Index/Index.tsx";
import Login from "./routes/Login/Login";
import Signup from "./routes/Signup/Signup";

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
