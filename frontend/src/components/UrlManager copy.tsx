import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { UrlListlist } from "./UrlListlist";
import api from "../services/api";

// Importa seu Navbar aqui
import Navbar from "./Navbar";

interface UrlData {
  id: number;
  original: string;
  slug: string;
  visits: number;
  createdAt: string;
}

interface GetUrlsResponse {
  urls: UrlData[];
}

type Props = {
  search: string;
};

export const UrlManager: React.FC<Props> = ({ search }) => {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedUrls, setUpdatedUrls] = useState<Record<number, UrlData>>({});

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const res = await api.get<GetUrlsResponse>("/api/urls", { withCredentials: true });
        setUrls(res.data.urls);
      } catch (err: any) {
        setError(err.response?.data?.error || "Erro ao buscar URLs");
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, []);

  const handleChange = (id: number, field: keyof UrlData, value: string) => {
    setUpdatedUrls((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = async (id: number) => {
    try {
      const updated = updatedUrls[id];
      const res = await api.put<UrlData>(`/api/urls/${id}`, {
        withCredentials: true,
        originalUrl: updated.original,
        shortSlug: updated.slug,
      });

      setUrls((prev) =>
        prev.map((url) => (url.id === id ? res.data : url))
      );
      setEditingId(null);
    } catch (err: any) {
      alert(err.response?.data?.error || "Erro ao salvar alterações.");
    }
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
    const url = urls.find((u) => u.id === id);
    if (url) {
      setUpdatedUrls((prev) => ({
        ...prev,
        [id]: { ...url },
      }));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja deletar essa URL?")) return;
    try {
      await api.delete(`/api/urls/${id}`, { withCredentials: true });
      setUrls((prev) => prev.filter((u) => u.id !== id));
      if (editingId === id) setEditingId(null);
    } catch {
      alert("Erro ao deletar URL.");
    }
  };

  // ... (seu código de edição, salvar, deletar etc)

  return (
    <>
      {/* Coloca o Navbar aqui no topo */}
      <Navbar />

      {/* Passa as urls para o componente de listagem */}
      <UrlListlist urls={urls} />

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Atualizar URL personalizada
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : urls.length === 0 ? (
          <Typography>Nenhuma URL encontrada.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>URL Original</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {urls.map((url) => (
                <TableRow key={url.id}>
                  <TableCell className="texto">
                    {editingId === url.id ? (
                      <TextField
                        value={updatedUrls[url.id]?.original || ""}
                        onChange={(e) =>
                          handleChange(url.id, "original", e.target.value)
                        }
                        fullWidth
                        size="small"
                      />
                    ) : (
                      url.original
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === url.id ? (
                      <TextField
                        style={{width: 80}}
                        value={updatedUrls[url.id]?.slug || ""}
                        onChange={(e) =>
                          handleChange(url.id, "slug", e.target.value)
                        }
                        fullWidth
                        size="small"
                      />
                    ) : (
                      url.slug
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === url.id ? (
                      <IconButton onClick={() => handleSave(url.id)} color="primary">
                        <SaveIcon />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => handleEdit(url.id)} color="primary">
                        <EditIcon />
                      </IconButton>
                    )}
                    <IconButton onClick={() => handleDelete(url.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Container>
    </>
  );
};
