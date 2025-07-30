import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import api from "../services/api"; // substitua se o caminho for diferente

interface User {
  id: number;
  name: string;
  email: string;
}

export const UserProfileEditor: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get<User>("/api/user/me", {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err: any) {
        setError("Erro ao carregar dados do usuário.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (field: keyof User, value: string) => {
    setUser((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSave = async () => {
    if (!user) return;
    setUpdating(true);
    setSuccess(false);
    setError(null);

    try {
      await api.put(`/api/user/${user.id}`, {
        name: user.name,
        email: user.email,
      }, {
        withCredentials: true,
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao atualizar usuário.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error && !user) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box maxWidth={400} mx="auto" mt={4}>
      <Typography variant="h6" gutterBottom>
        Editar Perfil do Usuário
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Dados atualizados com sucesso!</Alert>}

      <TextField
        label="Nome"
        value={user?.name || ""}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        value={user?.email || ""}
        onChange={(e) => handleChange("email", e.target.value)}
        fullWidth
        margin="normal"
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        disabled={updating}
        sx={{ mt: 2 }}
      >
        {updating ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </Box>
  );
};
