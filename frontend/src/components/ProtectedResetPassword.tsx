import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as jwt_decode from "jwt-decode";
import { ResetPassword } from "./ResetPassword";
import "./nav.css"
import { Typography } from "@mui/material";

/*interface TokenPayload {
  id: number;
  email: string;
  exp: number;
  iat: number;
}*/

const ProtectedResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Validando token...');
  console.info(message)

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setMessage('Token não encontrado na URL.');
      return;
    }

    try {
      const decoded = (jwt_decode as any)(token);

      if (!decoded.exp || Date.now() >= decoded.exp * 1000) {
        setMessage('Token expirado.');
      } else {
        setMessage(`Token válido para o usuário: ${decoded.email}`);
      }
    } catch (e) {
      setMessage('Token inválido.');
    }
  }, [searchParams]);

  return (
    <div>
      <Typography 
        className="logoPass"
        sx={{
          cursor: "pointer",
          fontWeight: "bold",
          flexShrink: 0,
        }}
        style={{fontSize: 30}}
      >
        UrlCurt
      </Typography>
      <hr />
      <ResetPassword/>
    </div>
  );
};

export default ProtectedResetPassword;
