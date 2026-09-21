import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/home";
import Index from "./routes/index/index.tsx";
import Login from "./routes/login/login";
import Signup from "./routes/signup/signup";
import { useEffect } from "react";
import { useAuthStore } from "./store/auth-store.tsx";

function App() {
  console.log("1. App se está evaluando");
  const { getLogged } = useAuthStore();
  console.log("2. Store leída correctamente");

  useEffect(() => {
    console.log("3. useEffect disparado");
    getLogged();
  }, []);

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
