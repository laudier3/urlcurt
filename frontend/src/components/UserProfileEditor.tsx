import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom"
import api from "../services/api";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
}

export const UserProfileEditor: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get<User>("/api/me", { withCredentials: true });
        setUser(res.data);
      } catch (err: any) {
        console.error(err);
        setError("Erro ao carregar dados do usuário.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (field: keyof User, value: string) => {
    setUser((prev) =>
      prev ? { ...prev, [field]: field === "age" ? Number(value) : value } : prev
    );
  };

  const handleSave = async () => {
    if (!user) return;
    setUpdating(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await api.put<User>(
        "/api/me",
        {
          name: user.name,
          email: user.email,
          phone: user.phone,
          age: user.age,
        },
        { withCredentials: true }
      );

      setUser(res.data);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Erro ao atualizar usuário.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error && !user) return <Alert severity="error">{error}</Alert>;

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
      <TextField
        label="Telefone"
        value={user?.phone || ""}
        onChange={(e) => handleChange("phone", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Idade"
        type="number"
        value={user?.age || ""}
        onChange={(e) => handleChange("age", e.target.value)}
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
      <button
        type="button"
        onClick={() => navigate('/')}
      >
        Voltar para Home
      </button>
    </Box>
  );
};
