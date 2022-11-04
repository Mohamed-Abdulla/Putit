import { Box, Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Loading from "../common/Loading";

const AuthLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return loading ? (
    <Loading fullHeight />
  ) : (
    <Container component="main" maxWidth="xl">
      <Outlet />
    </Container>
  );
};

export default AuthLayout;
