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
  Drawer,
  List,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ListItemButton from "@mui/material/ListItemButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import "./nav.css";

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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  const handleLogout = async () => {
    handleMenuClose();
    deleteAllCookies();
    try {
      await api.post("/api/logout", {}, { withCredentials: true });
    } catch {}
    await logout();
    navigate("/");
    window.location.reload();
  };

  const handleEditProfile = () => {
    handleMenuClose();
    navigate("/edit-profile");
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(45deg, #4F46E5 30%, #6D28D9 90%)",
          boxShadow: "0 4px 15px rgba(79, 70, 229, 0.4)",
          py: 1,
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
          }}
        >
          <Typography
            variant={isMobile ? "h6" : "h5"}
            onClick={() => navigate("/app")}
            className="logo"
            sx={{ cursor: "pointer", fontWeight: "bold", flexShrink: 0 }}
          >
            UrlCurt
          </Typography>

          {/* Mobile menu icon */}
          {isMobile ? (
            <>
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setDrawerOpen(true)}
                aria-label="menu"
              >
                <MenuIcon />
              </IconButton>

              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              >
                <Box
                  sx={{
                    width: 250,
                    height: "100%",
                    bgcolor: "background.paper",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  role="presentation"
                  onClick={() => setDrawerOpen(false)}
                  onKeyDown={() => setDrawerOpen(false)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      p: 1,
                    }}
                  >
                    <IconButton onClick={() => setDrawerOpen(false)}>
                      <CloseIcon />
                    </IconButton>
                  </Box>

                  <List>
                    <ListItemButton onClick={() => navigate("/app")}>
                      <ListItemText primary="Início" />
                    </ListItemButton>

                    {user ? (
                      <>
                        <ListItemButton onClick={handleEditProfile}>
                          <ListItemText primary="Editar Perfil" />
                        </ListItemButton>
                        <ListItemButton onClick={handleLogout}>
                          <ListItemText primary="Sair" />
                        </ListItemButton>
                      </>
                    ) : (
                      <>
                        <ListItemButton onClick={() => navigate("/login")}>
                          <ListItemText primary="Login" />
                        </ListItemButton>
                        <ListItemButton onClick={() => navigate("/register")}>
                          <ListItemText primary="Registrar" />
                        </ListItemButton>
                      </>
                    )}
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            // Desktop navigation
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {user ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body1"
                    title={user.name}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 120,
                    }}
                  >
                    Olá, <strong>{user.name}</strong>
                  </Typography>
                  <Tooltip title="Configurações">
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
                      <Avatar sx={{ bgcolor: stringToColor(user.name) }}>
                        {userInitial}
                      </Avatar>
                    </IconButton>
                  </Tooltip>

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
                        zIndex: 1301,
                      },
                    }}
                  >
                    <MenuItem onClick={handleEditProfile}>Editar Perfil</MenuItem>
                    <MenuItem onClick={handleLogout}>Sair</MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Box sx={{ display: "flex", gap: 1 }}>
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
                </Box>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
