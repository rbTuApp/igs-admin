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
  FormControl,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { AssignmentLate, Edit, Group, Person, Store } from "@mui/icons-material";
import { consumeGet, URL } from "../utils/constants";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "../context";
import axios from "axios";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
const options = [
  "URGENCIAS",
  "U.S.M.PSICOLOGIA",
  "CIRUGIA GASTROINTESTINAL Y END",
  "CIRUGIA LAPAROSCOPIA",
  "CIRUGIA VASCULAR PERIFERICA",
  "CIRUGIA GENERAL",
  "REEMPLAZO ARTICULAR",
  "CIRUGIA PEDIATRICA",
  "CIRUGIA PLASTICA",
  "DERMATOLOGIA",
  "GINECOLOGIA GENERAL",
  "MEDICINA INTERNA",
  "NEFROLOGIA",
  "NEUROCIRUJANO",
  "NUTRICIONISTA CLINICA",
  "CIRUGIA ORAL Y MAXILOFACIAL",
  "ORTOPEDIA ONCOLOGICA TUMORES",
  "ORTOPEDIA",
  "OTORR.GRAL",
]
const days = [
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
  "Domingo"
]

export default function Doctors() {
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
      first_name: "",
      last_name: "",
      price: "",
      email: "",
      password: "",
      confirmPassword: "",
      description: "",
      speciality: "",
      dateBird: "",
      document: "",
      daysWork: [1, 2, 3, 4, 5]
    },
  });
  const [selectedPhotoAdmin, setSelectedPhotoAdmin] = useState({
    open: false,
    admin: null
  })
  const [errors, setErrors] = useState(null);
  const [deleteModalAdmin, setDeleteModalAdmin] = useState(null);
  const handleEraseAdmin = async () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwtToken"),
      },
    };

    const result = await axios.delete(
      `${URL}doctor/${deleteModalAdmin}`,
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
  const handlePhoto = async (photo) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("doctorId", selectedPhotoAdmin.admin._id);
      if (photo) {
        formData.append("image", photo);
      }
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("jwtToken"),
          "Access-Control-Allow-Origin": "*",
        },
      };

      const result = await axios.post(`${URL}doctor/photo`, formData, config);
      if (result.status === 200) {
        setSelectedPhotoAdmin({ admin: result.data, open: true })
        const filtered = admins.filter((a) => a._id !== result.data._id);
        setAdmins([...filtered, result.data]);
        setErrors(null);
      } else {
        setErrors({ errors: { photo: "Error subiendo la foto" } });
        console.log(result.data);
      }
      setErrors(null);
      setLoading(false);
    } catch (err) {
      setErrors({ errors: { photo: "Error subiendo la foto" } });
      setLoading(false);
    }
  };
  const uploadAdmin = async () => {
    try {
      setLoading(true);
      let formData;
      if (selectedAdmin.edit) {
        formData = { ...selectedAdmin.admin, doctorId: selectedAdmin.admin._id };
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
          `${URL}doctor/${selectedAdmin.admin._id}`,
          formData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("jwtToken"),
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      } else {
        result = await axios.post(`${URL}doctor`, formData, config);
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
        setSelectedAdmin({
          open: false, admin: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirmPassword: "",
            description: "",
            speciality: "",
            dateBird: "",
            document: "",
            price: "",
            daysWork: [1, 2, 3, 4, 5]
          }, edit: false
        });
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
        const result = await consumeGet("doctor", {});

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
  const handleDayChange = (d) => {
    let days = selectedAdmin.admin.daysWork;
    if (days.includes(d)) {
      days = days.filter((v) => v !== d);
    } else {
      days.push(d)
    }
    setSelectedAdmin({ ...selectedAdmin, admin: { ...selectedAdmin.admin, daysWork: days } })
  }
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      {
        selectedPhotoAdmin.open && (

          <Dialog open={true}>
            <Box style={{ padding: 12 }}>
              <DialogTitle
                style={{
                  marginBottom: 20,
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: 800,
                }}
              >
                Foto del doctor
              </DialogTitle>
              <DialogContent>
                {
                  !selectedPhotoAdmin.admin.photo || selectedPhotoAdmin.admin.photo === "" ? (
                    <Typography>No tienes ninguna foto de este doctor</Typography>
                  ) : (
                    <img src={URL + selectedPhotoAdmin.admin.photo} height={250} />
                  )
                }
              </DialogContent>
              <DialogActions>
                <Button
                  color="inherit"
                  onClick={() => {
                    setErrors(null);
                    setSelectedPhotoAdmin({ admin: null, open: false })
                  }}
                  variant="contained"
                  disabled={loading}
                  style={{ width: "49%", marginRight: 4 }}
                >
                  Salir
                </Button>
                <Button
                  style={{ width: "49%" }}
                  variant="contained"
                  component="label"
                  disabled={loading}
                >
                  {selectedPhotoAdmin.admin.photo || selectedPhotoAdmin.admin.photo === "" ? "Subir" : "Cambiar"}
                  <input
                    type="file"
                    onChange={(e) =>
                      handlePhoto(e.target.files[0])
                    }
                    hidden
                  />
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
        )
      }
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
            Eliminar doctor
          </DialogTitle>
          <DialogContent>
            <Typography style={{ marginBottom: 12 }}>
              ¿Está seguro? Perderás toda la información en este doctor
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
                first_name: "",
                last_name: "",
                email: "",
                password: "",
                confirmPassword: "",
                description: "",
                price: "",
                speciality: "",
                dateBird: "",
                document: "",
                daysWork: [1, 2, 3, 4, 5]
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
            Agregar doctor
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
                  value={selectedAdmin.admin.first_name}
                  onChange={(e) =>
                    setSelectedAdmin({
                      ...selectedAdmin,
                      admin: {
                        ...selectedAdmin.admin,
                        first_name: e.target.value,
                      },
                    })
                  }
                />
              </Grid>
            </Grid>
            <Grid
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 15,
              }}
              container
            >
              <Grid xs={4}>
                <Typography style={{ marginRight: 8 }}>Apellido</Typography>
              </Grid>
              <Grid xs={8}>
                <TextField
                  value={selectedAdmin.admin.last_name}
                  onChange={(e) =>
                    setSelectedAdmin({
                      ...selectedAdmin,
                      admin: {
                        ...selectedAdmin.admin,
                        last_name: e.target.value,
                      },
                    })
                  }
                />
              </Grid>
            </Grid>
            <Grid
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 15,
              }}
              container
            >
              <Grid xs={4}>
                <Typography style={{ marginRight: 8 }}>Documento</Typography>
              </Grid>
              <Grid xs={8}>
                <TextField
                  value={selectedAdmin.admin.document}
                  onChange={(e) =>
                    setSelectedAdmin({
                      ...selectedAdmin,
                      admin: {
                        ...selectedAdmin.admin,
                        document: e.target.value,
                      },
                    })
                  }
                />
              </Grid>
            </Grid>
            <Grid
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 15,
              }}
              container
            >
              <Grid xs={4}>
                <Typography style={{ marginRight: 8 }}>Fecha de nacimiento</Typography>
              </Grid>
              <Grid xs={8}>
                <TextField
                  placeholder="dd/mm/yyyy"
                  value={selectedAdmin.admin.dateBird}
                  onChange={(e) =>
                    setSelectedAdmin({
                      ...selectedAdmin,
                      admin: {
                        ...selectedAdmin.admin,
                        dateBird: e.target.value,
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
                <Typography style={{ marginRight: 8 }}>Breve descripcion del perfil</Typography>
              </Grid>
              <Grid xs={8}>
                <TextField
                  value={selectedAdmin.admin.description}
                  onChange={(e) =>
                    setSelectedAdmin({
                      ...selectedAdmin,
                      admin: {
                        ...selectedAdmin.admin,
                        description: e.target.value,
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
                <Typography style={{ marginRight: 8 }}>Coste de consulta</Typography>
              </Grid>
              <Grid xs={8}>
                <TextField
                  type="number"
                  value={selectedAdmin.admin.price}
                  onChange={(e) =>
                    setSelectedAdmin({
                      ...selectedAdmin,
                      admin: {
                        ...selectedAdmin.admin,
                        price: e.target.value,
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
                <Typography style={{ marginRight: 8 }}>Especialidad</Typography>
              </Grid>
              <Grid xs={8}>
                <Select
                  value={selectedAdmin.admin.speciality}
                  fullWidth
                  style={{ maxWidth: "90.666667%" }}
                  onChange={(e) =>
                    setSelectedAdmin({
                      ...selectedAdmin,
                      admin: {
                        ...selectedAdmin.admin,
                        speciality: e.target.value,
                      },
                    })
                  }
                >
                  {options.map((m, i) => (
                    <MenuItem key={i} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </Select>
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
            <Typography style={{ fontWeight: 800, fontSize: 16, textAlign: "center", marginBottom: 18 }}>
              Dias Laborales
            </Typography>
            <Grid
              style={{
                justifyContent: "center",
                alignItems: "center  ",
                marginBottom: 18,
              }}
              container
            >
              {days.map((d, i) => (
                <Grid xs={3} marginBottom={i < 4 ? 2 : 0} key={i}>
                  <Button onClick={() => handleDayChange(i + 1)} variant={selectedAdmin.admin.daysWork.includes(i + 1) ? "contained" : "outlined"}>{d}</Button>
                </Grid>
              ))}
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
        <Typography style={{ fontWeight: 800, fontSize: 18, textAlign: "center" }}>Doctores</Typography>
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
                          first_name: "",
                          last_name: "",
                          email: "",
                          password: "",
                          description: "",
                          price: "",
                          confirmPassword: "",
                          speciality: "",
                          dateBird: "",
                          document: "",
                          daysWork: [1, 2, 3, 4, 5]
                        },
                        edit: false,
                      })
                    }
                    variant="contained"
                  >
                    Añadir doctor
                  </Button>
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center">
                  {admins.length > 0 ? (

                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>Nombre</TableCell>
                          <TableCell>Apellido</TableCell>
                          <TableCell>Documento</TableCell>
                          <TableCell>Especialidad</TableCell>
                          <TableCell>Correo</TableCell>
                          <TableCell style={{ textAlign: "center" }}>Foto</TableCell>
                          <TableCell style={{ textAlign: "center" }}>
                            Editar
                          </TableCell>
                          <TableCell style={{ textAlign: "center" }}>
                            Eliminar
                          </TableCell>
                        </TableRow>
                        {admins.map((a) => (
                          <TableRow>
                            <TableCell>{a.first_name}</TableCell>
                            <TableCell>{a.last_name}</TableCell>
                            <TableCell>{a.document}</TableCell>
                            <TableCell>{a.speciality}</TableCell>
                            <TableCell>{a.email}</TableCell>
                            <TableCell style={{ textAlign: "center" }}>
                              <Button
                                onClick={() =>
                                  setSelectedPhotoAdmin({
                                    open: true,
                                    admin: { ...a },
                                  })
                                }
                                color="inherit"
                              >
                                <CameraAltIcon />
                              </Button>
                            </TableCell>
                            <TableCell style={{ textAlign: "center" }}>
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
                            <TableCell style={{ textAlign: "center" }}>
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
                  ) : (
                    <Box
                      width="100%"
                      height={400}
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <AssignmentLate style={{ fontSize: 92 }} />
                      <Typography>No hay doctores en el sistema</Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box >
    </LocalizationProvider >
  );
}
