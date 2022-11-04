import React, { useState } from "react";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setBoards } from "../redux/features/boardSlice";
import boardApi from "../api/boardApi";

const Home = () => {
  const [drawerOpen, setDrawerOpen] = useOutletContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    setDrawerOpen((prev) => !prev);
  };

  const createBoard = async () => {
    setLoading(true);
    try {
      const res = await boardApi.create();
      dispatch(setBoards([res.data]));
      navigate(`/boards/${res.data.id}`);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box>
      <Tooltip title="Sidebar">
        <IconButton onClick={handleClick} edge="start" aria-label="open drawer" sx={{ ml: !drawerOpen ? 0.2 : "" }}>
          <Menu />
        </IconButton>
      </Tooltip>
      <Box
        sx={{
          height: drawerOpen ? "90vh" : "calc(100vh - 60px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button variant="outlined" color="success" size="large" onClick={createBoard}>
          Click here to create your first board
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
