import "./App.css";
import CssBaseLine from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import AuthLayout from "./components/layout/AuthLayout";
import Home from "./pages/Home";
import Board from "./pages/Board";
import Auth from "./pages/Auth";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import { useSelector } from "react-redux";

function App() {
  const [mode, setMode] = useState("light");
  const theme = createTheme({
    palette: { mode: mode },
  });

  const user = useSelector((state) => state.user.currentUser);

  return (
    // <GoogleOAuthProvider clientId="http://597976957671-grmrcp3eu7tg3oo1rpr4r73kd5lchknq.apps.googleusercontent.com/">
    <ThemeProvider theme={theme}>
      <CssBaseLine />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route path="login" element={!user ? <Auth /> : <Navigate to="/boards" />} />
          </Route>

          <Route path="/" element={<AppLayout setMode={setMode} mode={mode} />}>
            <Route index element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="boards" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="boards/:boardId" element={<Board />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
    // </GoogleOAuthProvider>
  );
}

export default App;
