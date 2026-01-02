import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import { Box, CircularProgress } from "@mui/material";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, admin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAdmin) {
        if (!admin) {
          router.push("/admin");
        }
      } else {
        if (!user) {
          router.push("/login");
        }
      }
    }
  }, [user, admin, loading, router, requireAdmin]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#0a0e27",
        }}
      >
        <CircularProgress sx={{ color: "#00ffff" }} />
      </Box>
    );
  }

  if (requireAdmin && !admin) {
    return null;
  }

  if (!requireAdmin && !user) {
    return null;
  }

  return <>{children}</>;
}

