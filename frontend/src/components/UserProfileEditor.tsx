import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
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
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false); // ✅ novo estado

  const navigate = useNavigate();

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

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.delete("/api/me", { withCredentials: true });

      setDeleteSuccess(true); // ✅ mostra mensagem de sucesso
      setConfirmDeleteOpen(false);

      setTimeout(() => {
        navigate("/");
        window.location.reload()
      }, 5000); // ✅ redireciona após 5s
    } catch (err) {
      setError("Erro ao excluir conta.");
    } finally {
      setDeleting(false);
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
      {deleteSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Sua conta foi excluída com sucesso! Redirecionando para a home...
        </Alert>
      )}

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

      <Button
        variant="outlined"
        color="error"
        onClick={() => setConfirmDeleteOpen(true)}
        sx={{ mt: 2 }}
        fullWidth
      >
        Excluir Conta
      </Button>

      <Button
        variant="text"
        onClick={() => navigate("/")}
        sx={{ mt: 2 }}
        fullWidth
      >
        Voltar para Home
      </Button>

      {/* Diálogo de Confirmação */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir sua conta? Todos os seus dados, URLs e estatísticas
            serão apagados permanentemente.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} disabled={deleting}>
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? "Excluindo..." : "Confirmar Exclusão"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
