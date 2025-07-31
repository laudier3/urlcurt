import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
//import SettingsIcon from "@mui/icons-material/Settings";
import { useAuth } from "../hooks/useAuth";
import Cookies from "js-cookie";
import "./nav.css"

const stringToColor = (string: string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const deleteAllCookies = () => {
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
    };

  /*const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate("/");
    window.location.reload()
  };*/
  
  const handleLogout = async () => {
    handleMenuClose();
    Cookies.remove("token"); // 🧼 remove o cookie do token
    deleteAllCookies()
    await logout();          // 👈 limpa o estado global/contexto (user)
    navigate("/");
    window.location.reload()
  };


  const handleEditProfile = () => {
    handleMenuClose();
    navigate("/edit-profile");
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(45deg, #4F46E5 30%, #6D28D9 90%)",
        boxShadow: "0 4px 15px rgba(79, 70, 229, 0.4)",
        py: 1,
        overflow: "visible",
        borderRadius: 2,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: 1200,
          mx: "auto",
          width: "100%",
          px: { xs: 2, sm: 3 },
          overflow: "visible",
          position: "relative",
        }}
      >
        <Typography
          variant="h5"
          onClick={() => navigate("/app")}
          className="logo"
        >
          UrlCurt
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            position: "relative",
          }}
        >
          {user ? (
            <div className="users">
              <Typography
                variant="body1"
                className="users"
                title={user.name}
              >
                Olá, <strong>{user.name}</strong>
                <Tooltip title="Configurações" style={{marginLeft: "-50px"}}>
                <IconButton
                  onClick={handleMenuOpen}
                  color="inherit"
                  sx={{
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "rotate(20deg)",
                      color: theme.palette.secondary.light,
                    },
                  }}
                  aria-controls={open ? "settings-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                 <Avatar
                    sx={{
                    bgcolor: stringToColor(user.name),
                    }}
                    className="avatar"
                >
                    {userInitial}
                </Avatar>
                </IconButton>
              </Tooltip>
              </Typography>

              <Menu
                id="settings-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 160,
                    boxShadow: "rgba(0, 0, 0, 0.2) 0px 8px 24px",
                    zIndex: 1301, // Garante que o menu fique sobreposto corretamente
                  },
                }}
                 className="setting"
              >
                <MenuItem onClick={handleEditProfile}>Editar Perfil</MenuItem>
                <MenuItem onClick={handleLogout}>Sair</MenuItem>
              </Menu>
            </div>
          ) : (
            <>
              <Button
                color="inherit"
                variant="outlined"
                onClick={() => navigate("/login")}
                sx={{
                  borderColor: "rgba(255,255,255,0.7)",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.15)",
                    borderColor: "#fff",
                  },
                }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                variant="contained"
                onClick={() => navigate("/register")}
                sx={{
                  bgcolor: "#fff",
                  color: "#4F46E5",
                  fontWeight: "bold",
                  "&:hover": {
                    bgcolor: "#ddd",
                  },
                }}
              >
                Registrar
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
