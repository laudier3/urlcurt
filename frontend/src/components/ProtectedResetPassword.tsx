import React, { useEffect, useState } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import * as jwtDecode from "jwt-decode";

interface TokenPayload {
  id: number;
  email: string;
  exp: number;
  iat: number;
}

const ProtectedResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setIsValid(false);
      return;
    }

    try {
      const decoded = (jwtDecode as any)(token) as TokenPayload;

      if (!decoded.exp || Date.now() >= decoded.exp * 1000) {
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    } catch {
      setIsValid(false);
    }
  }, [searchParams]);

  if (isValid === null) {
    return <p>Validando token...</p>;
  }

  if (!isValid) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      {/* Aqui você pode renderizar seu componente ResetPassword com token válido */}
      <h2>Redefinir senha</h2>
      {/* Seu formulário de reset de senha */}
    </div>
  );
};

export default ProtectedResetPassword;
