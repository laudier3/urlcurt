import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Alert,
} from "@mui/material";
import api from "../services/api";

interface GeoData {
  country: string;
  region: string;
  city: string;
  count: number;
}

interface Props {
  urlId: number;
}

export const GeoLocationStats: React.FC<Props> = ({ urlId }) => {
  const [data, setData] = useState<GeoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGeo = async () => {
      try {
        const res = await api.get<GeoData[]>(`/api/urls/${urlId}/geo`);
        console.log(res)
        setData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Erro ao buscar dados geográficos");
      } finally {
        setLoading(false);
      }
    };

    fetchGeo();
  }, [urlId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={2}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Estatísticas de Geolocalização
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>País</TableCell>
            <TableCell>Região</TableCell>
            <TableCell>Cidade</TableCell>
            <TableCell>Visitas</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{row.country}</TableCell>
              <TableCell>{row.region}</TableCell>
              <TableCell>{row.city}</TableCell>
              <TableCell>{row.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
