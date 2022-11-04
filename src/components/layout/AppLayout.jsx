import { Box } from "@mui/material";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";

const AppLayout = ({ setMode, mode }) => {
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <Box display="flex" backgroundColor="#F6F7FB" minWidth="100vw" width="max-content">
      <Sidebar setMode={setMode} mode={mode} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
      <Box
        sx={{
          flexGrow: 1,
          p: 1,
          width: "calc(100vw - 300px)",
        }}
      >
        <Outlet context={[drawerOpen, setDrawerOpen]} />
      </Box>
    </Box>
  );
};

export default AppLayout;
