import React, { useEffect, useState, useContext, Fragment } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  TextField,
  TableRow,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  Select,
  MenuItem,
} from "@mui/material";
import { Edit, Group, Person, Store } from "@mui/icons-material";
import { consumeGet, URL } from "../utils/constants";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "../context";
import axios from "axios";

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    user,
    logout,
  } = useContext(AuthContext);

  const [selectedAdmin, setSelectedAdmin] = useState({
    open: false,
    edit: false,
    admin: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      onlyPQR: false
    },
  });
  const [errors, setErrors] = useState(null);
  const [deleteModalAdmin, setDeleteModalAdmin] = useState(null);
  const handleEraseAdmin = async () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwtToken"),
      },
    };

    const result = await axios.delete(
      `${URL}admin/${deleteModalAdmin}`,
      config
    );
    setDeleteModalAdmin(null);
    if (result.status === 200) {
      const filteredAdmins = admins.filter((a) => a._id !== result.data._id);
      setAdmins([...filteredAdmins]);
    } else {
      console.log("errors");
    }
  };
  const uploadAdmin = async () => {
    try {
      setLoading(true);
      let formData;
      if (selectedAdmin.edit) {
        formData = selectedAdmin.admin;
      } else {
        formData = { ...selectedAdmin.admin };
      }
      formData.userId = user._id;
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwtToken"),
          "Access-Control-Allow-Origin": "*",
        },
      };

      let result = null;
      if (selectedAdmin.edit) {
        result = await axios.put(
          `${URL}admin/${selectedAdmin.admin._id}`,
          formData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("jwtToken"),
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      } else {
        result = await axios.post(`${URL}admin`, formData, config);
      }
      if (result.status === 200) {
        setErrors(null);
        if (selectedAdmin.edit) {
          const arrayAdminds = admins.map((a) => {
            if (result.data._id === a._id) {
              return result.data;
            } else {
              return a;
            }
          });
          setAdmins([...arrayAdminds]);
        } else {
          setAdmins([...admins, result.data]);
        }
        setSelectedAdmin({ open: false, admin: {}, edit: false });
      } else {
        setErrors(result.data);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);

      setErrors(err.response.data.errors);
    }
  };
  useEffect(() => {
    const tryFunct = async () => {
      try {
        const result = await consumeGet("admin", {});

        if (result.status === 200) {
          setAdmins(result.data);
        } else {
          console.log(result);
        }
      } catch (err) {
        console.log(err);
      }
    };
    tryFunct();
  }, []);
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Dialog open={deleteModalAdmin}>
        <Box style={{ padding: 12 }}>
          <DialogTitle
            style={{
              marginBottom: 20,
              textAlign: "center",
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            Eliminar administrador
          </DialogTitle>
          <DialogContent>
            <Typography style={{ marginBottom: 12 }}>
              ¿Está seguro? Perderás toda la información en este administrador
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              color="inherit"
              onClick={() => setDeleteModalAdmin(null)}
              variant="contained"
              style={{ width: "50%" }}
            >
              Cancelar
            </Button>
            <Button
              style={{ width: "50%" }}
              onClick={() => handleEraseAdmin()}
              variant="contained"
            >
              Ok
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Dialog open={selectedAdmin.open}>
        <Button
          onClick={() =>
            setSelectedAdmin({
              open: false,
              edit: false,
              admin: {
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
                market: "",
              },
            })
          }
          variant="contained"
          style={{
            position: "absolute",
            top: 5,
            right: 5,
            height: 40,
            width: 40,
            borderRadius: 40,
          }}
        >
          <Typography fontSize={20}>X</Typography>
        </Button>
        <Box style={{ padding: 12 }}>
          <DialogTitle
            style={{
              marginBottom: 20,
              textAlign: "center",
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            Agregar administrador
          </DialogTitle>
          <DialogContent>
            <Grid
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 15,
              }}
              container
            >
              <Grid xs={4}>
                <Typography style={{ marginRight: 8 }}>Nombre</Typography>
              </Grid>
              <Grid xs={8}>
                <TextField
                  placeholder="Name"
                  value={selectedAdmin.admin.username}
                  onChange={(e) =>
                    setSelectedAdmin({
                      ...selectedAdmin,
                      admin: {
                        ...selectedAdmin.admin,
                        username: e.target.value,
                      },
                    })
                  }
                />
              </Grid>
            </Grid>
            <Grid
              style={{
                justifyContent: "center",
                alignItems: "center  ",
                marginBottom: 18,
              }}
              container
            >
              <Grid xs={4}>
                <Typography style={{ marginRight: 8 }}>Correo</Typography>
              </Grid>
              <Grid xs={8}>
                <TextField
                  placeholder="Mail"
                  value={selectedAdmin.admin.email}
                  onChange={(e) =>
                    setSelectedAdmin({
                      ...selectedAdmin,
                      admin: {
                        ...selectedAdmin.admin,
                        email: e.target.value,
                      },
                    })
                  }
                />
              </Grid>
            </Grid>
            <Grid
              style={{
                justifyContent: "center",
                alignItems: "center  ",
                marginBottom: 18,
              }}
              container
            >
              <Grid xs={4}>
                <Typography style={{ marginRight: 8 }}>Contraseña</Typography>
              </Grid>
              <Grid xs={8}>
                <TextField
                  placeholder="Password"
                  value={selectedAdmin.admin.password}
                  onChange={(e) =>
                    setSelectedAdmin({
                      ...selectedAdmin,
                      admin: {
                        ...selectedAdmin.admin,
                        password: e.target.value,
                      },
                    })
                  }
                />
              </Grid>
            </Grid>
            <Grid
              style={{
                justifyContent: "center",
                alignItems: "center  ",
                marginBottom: 18,
              }}
              container
            >
              <Grid xs={4}>
                <Typography style={{ marginRight: 8 }}>
                  Confirmar Contraseña
                </Typography>
              </Grid>
              <Grid xs={8}>
                <TextField
                  placeholder="Confirm Password"
                  value={selectedAdmin.admin.confirmPassword}
                  onChange={(e) =>
                    setSelectedAdmin({
                      ...selectedAdmin,
                      admin: {
                        ...selectedAdmin.admin,
                        confirmPassword: e.target.value,
                      },
                    })
                  }
                />
              </Grid>
            </Grid>
            <Grid
              style={{
                justifyContent: "center",
                alignItems: "center  ",
                marginBottom: 18,
              }}
              container
            >
              <Grid xs={4}>
                <Typography style={{ marginRight: 8 }}>
                  Solo para PQR
                </Typography>
              </Grid>
              <Grid xs={8}>
                <Select
                  value={selectedAdmin.admin.onlyPQR}
                  fullWidth
                  style={{ maxWidth: "90.666667%" }}
                  onChange={(e) =>
                    setSelectedAdmin({
                      ...selectedAdmin,
                      admin: {
                        ...selectedAdmin.admin,
                        onlyPQR: e.target.value,
                      },
                    })
                  }
                >
                  <MenuItem value={true}>
                    SI
                  </MenuItem>
                  <MenuItem value={false}>
                    NO
                  </MenuItem>
                </Select>
              </Grid>
            </Grid>
            {errors && (
              <Card style={{ width: "80%", marginLeft: "10%" }}>
                <CardContent>
                  {Object.values(errors).map((e) => (
                    <Typography color="#df4759" textAlign="center">
                      *{e}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            )}
          </DialogContent>
          <DialogActions>
            <Fragment>
              <Button
                style={{ width: "50%" }}
                onClick={() => uploadAdmin()}
                variant="contained"
                disabled={loading}
              >
                Guardar
              </Button>
            </Fragment>
          </DialogActions>
        </Box>
      </Dialog>
      <Box>
        <Box
          width="100%"
          marginBottom={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Card>
            <CardContent>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                marginRight={2}
              >
                <Person color="primary" style={{ fontSize: 82 }} />
              </Box>
              <Box>
                <Typography>{user.username}</Typography>
                <Typography>{user.email}</Typography>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  marginTop={2}
                >
                  <Button onClick={logout} variant="contained">
                    Cerrar sesión
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Typography style={{ fontWeight: 800, fontSize: 18, textAlign: "center" }}>Administradores</Typography>
        <Grid style={{ marginTop: 8 }} container>
          <Grid xs={12}>
            <Card>
              <CardContent>
                <Box
                  marginTop={3}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Button
                    onClick={() =>
                      setSelectedAdmin({
                        open: true,
                        admin: {
                          name: "",
                          email: "",
                          password: "",
                          confirmPassword: "",
                          onlyPQR: false
                        },
                        edit: false,
                      })
                    }
                    variant="contained"
                  >
                    Añadir administrador
                  </Button>
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Correo</TableCell>
                        <TableCell>
                          Editar
                        </TableCell>
                        <TableCell>
                          Eliminar
                        </TableCell>
                      </TableRow>
                      {admins.map((a) => (
                        <TableRow>
                          <TableCell>{a.username}</TableCell>
                          <TableCell>{a.email}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() =>
                                setSelectedAdmin({
                                  open: true,
                                  edit: true,
                                  admin: { ...a, password: "" },
                                })
                              }
                              color="inherit"
                            >
                              <Edit />
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => setDeleteModalAdmin(a._id)}
                              color="inherit"
                            >
                              <DeleteIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box >
    </LocalizationProvider >
  );
}
