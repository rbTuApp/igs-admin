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
import { AssignmentLate, Edit, Group, Person, Store, UploadFile } from "@mui/icons-material";
import { consumeGet, URL } from "../utils/constants";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "../context";
import axios from "axios";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
const options = [
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

export default function Users() {
  const [admins, setAdmins] = useState([]);
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(false);
  const [sucess, setSucess] = useState({ isSucceded: false, open: false })
  const [filter, setFilters] = useState("");
  const {
    user,
    logout,
  } = useContext(AuthContext);

  const [selectedAdmin, setSelectedAdmin] = useState({
    open: false,
    user: null
  });
  const [selectedPhotoAdmin, setSelectedPhotoAdmin] = useState({
    open: false,
    user: null,
    doctor: null,
  })
  const [errors, setErrors] = useState(null);
  const [deleteModalAdmin, setDeleteModalAdmin] = useState(null);
  const changeDoctor = async (user) => {
    try {
      setLoading(true);
      const result = await axios.put(
        `${URL}userDoctor`,
        { user, doctor: selectedPhotoAdmin.doctor },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwtToken"),
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      if (result.status === 200) {
        setErrors(null);
        const arrayAdminds = admins.map((a) => {
          if (result.data._id === a._id) {
            return result.data;
          } else {
            return a;
          }
        });
        setAdmins([...arrayAdminds]);
        setSelectedPhotoAdmin({
          open: false, user: null, doctor: null
        });
        setLoading(false);
      } else {
        setErrors({ errors: { user: "Algo ha salido mal" } })
      }
    } catch (err) {
      setLoading(false);

      setErrors(err.response.data.errors);
    }
  };

  const uploadHistory = async (file, userId) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("pdf", file);
      const result = await axios.post(
        `${URL}oldHistory`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwtToken"),
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      if (result.status === 200) {
        const arrayAdminds = admins.map((a) => {
          if (result.data._id === a._id) {
            return result.data;
          } else {
            return a;
          }
        });
        setAdmins([...arrayAdminds]);
        setSucess({ isSucceded: true, open: true })
        setLoading(false);
      } else {
        setSucess({ isSucceded: false, open: true })
      }
    } catch (err) {
      setLoading(false);

      setSucess({ isSucceded: false, open: true })
    }
  };

  useEffect(() => {
    const tryFunct = async () => {
      try {
        const result = await consumeGet("users", {});

        if (result.status === 200) {
          setAdmins(result.data);
        } else {
          console.log(result);
        }
        const result2 = await consumeGet("doctor", {});

        if (result.status === 200) {
          setDoctors(result2.data);
        } else {
          console.log(result2);
        }
      } catch (err) {
        console.log(err);
      }
    };
    tryFunct();
  }, []);
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
                Cambiar doctor de paciente
              </DialogTitle>
              <DialogContent>
                {
                  !selectedPhotoAdmin.user.doctor ? (
                    <Typography>Este usuario aun no tiene un doctor asignado</Typography>
                  ) : (
                    <Typography>El doctor de este usuario es: {selectedPhotoAdmin.user.doctor.first_name + " " + selectedPhotoAdmin.user.doctor.last_name}</Typography>
                  )
                }
                <Grid
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 15,
                    marginTop: 15
                  }}
                  container
                >
                  <Grid xs={4}>
                    <Typography style={{ marginRight: 8 }}>Filtro</Typography>
                  </Grid>
                  <Grid xs={8}>
                    <TextField
                      value={filter}
                      onChange={(ev) => setFilters(ev.target.value)}
                    />
                  </Grid>
                </Grid>
                <Table>
                  <TableBody >
                    <TableRow>
                      <TableCell align="center" style={{ fontWeight: "800" }} >DOCTORES</TableCell>
                    </TableRow>
                    {(doctors && doctors.length > 0) && doctors.filter((d) => {
                      const condition = new RegExp(`^${filter}`);
                      if (condition.test(d.first_name) || condition.test(d.last_name)) {
                        return true
                      }
                      return false
                    }).map(d => (
                      <TableRow onClick={() => setSelectedPhotoAdmin({ ...selectedPhotoAdmin, doctor: d._id })} style={{ cursor: "pointer", background: selectedPhotoAdmin.doctor === d._id ? "rgb(36, 40, 44)" : "#1B5A90", marginBottom: 2 }} hover>
                        <TableCell style={{ color: "white" }} align="center">{d.first_name + " " + d.last_name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                  onClick={() => {
                    changeDoctor(selectedPhotoAdmin.user._id)
                  }}
                  disabled={loading}
                >
                  Cambiar
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
        )
      }
      {
        sucess.open && (

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
                {sucess.isSucceded ? "Exitoso" : "Error"}
              </DialogTitle>
              <DialogContent>
                {
                  sucess.isSucceded ? (
                    <Typography>La historia clinica fue exitosamente asociada al usuario</Typography>
                  ) : (
                    <Typography>Ocurrio un error en medio de la asociación de la historia clinica</Typography>
                  )
                }
              </DialogContent>
              <DialogActions>
                <Button
                  color="inherit"
                  onClick={() => {
                    setSucess({ open: false, isSucceded: false });
                  }}
                  variant="contained"
                  disabled={loading}
                  style={{ width: "49%", marginRight: 4 }}
                >
                  Salir
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
        )
      }
      {selectedAdmin.open && (


        <Dialog open={true}>
          <Button
            onClick={() =>
              setSelectedAdmin({
                open: false,
                user: null
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
              Información de paciente
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
                    value={selectedAdmin.user.first_name}
                    disabled
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
                    value={selectedAdmin.user.last_name}
                    disabled
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
                  <Typography style={{ marginRight: 8 }}>Correo</Typography>
                </Grid>
                <Grid xs={8}>
                  <TextField
                    value={selectedAdmin.user.email}
                    disabled
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
                  <Typography style={{ marginRight: 8 }}>Telefono</Typography>
                </Grid>
                <Grid xs={8}>
                  <TextField
                    value={selectedAdmin.user.telefono}
                    disabled
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
                    value={selectedAdmin.user.dateBird}
                    disabled
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
                  <Typography style={{ marginRight: 8 }}>Tipo de documento</Typography>
                </Grid>
                <Grid xs={8}>
                  <TextField
                    value={selectedAdmin.user.typedoc}
                    disabled
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
                    value={selectedAdmin.user.document}
                    disabled
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
                  <Typography style={{ marginRight: 8 }}>Genero</Typography>
                </Grid>
                <Grid xs={8}>
                  <TextField
                    value={selectedAdmin.user.gender}
                    disabled
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
                  <Typography style={{ marginRight: 8 }}>Patologia</Typography>
                </Grid>
                <Grid xs={8}>
                  <TextField
                    value={selectedAdmin.user.pathology}
                    disabled
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
                  <Typography style={{ marginRight: 8 }}>Rh</Typography>
                </Grid>
                <Grid xs={8}>
                  <TextField
                    value={selectedAdmin.user.rh}
                    disabled
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
                  <Typography style={{ marginRight: 8 }}>Servicio</Typography>
                </Grid>
                <Grid xs={8}>
                  <TextField
                    value={selectedAdmin.user.service}
                    disabled
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
                  <Typography style={{ marginRight: 8 }}>Empresa encargada</Typography>
                </Grid>
                <Grid xs={8}>
                  <TextField
                    value={selectedAdmin.user.company}
                    disabled
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
                  <Typography style={{ marginRight: 8 }}>Nombre de familiar</Typography>
                </Grid>
                <Grid xs={8}>
                  <TextField
                    value={selectedAdmin.user.familiar}
                    disabled
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
                  <Typography style={{ marginRight: 8 }}>Ciudad</Typography>
                </Grid>
                <Grid xs={8}>
                  <TextField
                    value={selectedAdmin.user.city}
                    disabled
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
                  <Typography style={{ marginRight: 8 }}>Direccion</Typography>
                </Grid>
                <Grid xs={8}>
                  <TextField
                    value={selectedAdmin.user.direction}
                    disabled
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
                  <Typography style={{ marginRight: 8 }}>Causa de ingreso</Typography>
                </Grid>
                <Grid xs={8}>
                  <TextField
                    value={selectedAdmin.user.cause}
                    disabled
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
                  <Typography style={{ marginRight: 8 }}>Funcionario</Typography>
                </Grid>
                <Grid xs={8}>
                  <TextField
                    value={selectedAdmin.user.functioner}
                    disabled
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
                  <Typography style={{ marginRight: 8 }}>Antecedentes</Typography>
                </Grid>
                <Grid xs={8}>
                  <TextField
                    value={selectedAdmin.user.antecedentes}
                    disabled
                  />
                </Grid>
              </Grid>

            </DialogContent>
          </Box>
        </Dialog>
      )}
      <Box>
        <Typography style={{ fontWeight: 800, fontSize: 18, textAlign: "center" }}>Pacientes</Typography>
        <Grid style={{ marginTop: 8 }} container>
          <Grid xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="center" alignItems="center">
                  {admins.length > 0 ? (

                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>Nombre</TableCell>
                          <TableCell>Apellido</TableCell>
                          <TableCell>Documento</TableCell>
                          <TableCell>Patologia</TableCell>
                          <TableCell>Correo</TableCell>
                          <TableCell style={{ textAlign: "center" }}>Subir historia antigua</TableCell>
                          <TableCell style={{ textAlign: "center" }}>
                            Informacion
                          </TableCell>
                          <TableCell style={{ textAlign: "center" }}>
                            Cambiar doctor
                          </TableCell>
                        </TableRow>
                        {admins.map((a) => (
                          <TableRow>
                            <TableCell>{a.first_name}</TableCell>
                            <TableCell>{a.last_name}</TableCell>
                            <TableCell>{a.document}</TableCell>
                            <TableCell>{a.pathology}</TableCell>
                            <TableCell>{a.email}</TableCell>
                            <TableCell style={{ textAlign: "center" }}>
                              <Button
                                color="inherit"
                                disabled={loading}
                                component="label"
                              >
                                <input
                                  type="file"
                                  onChange={(e) =>
                                    uploadHistory(e.target.files[0], a._id)
                                  }
                                  hidden
                                />
                                <UploadFile />
                              </Button>
                            </TableCell>
                            <TableCell style={{ textAlign: "center" }}>
                              <Button
                                onClick={() =>
                                  setSelectedAdmin({
                                    open: true,
                                    user: { ...a },
                                  })
                                }
                                color="inherit"
                              >
                                <RemoveRedEyeIcon />
                              </Button>
                            </TableCell>
                            <TableCell style={{ textAlign: "center" }}>
                              <Button
                                onClick={() => setSelectedPhotoAdmin({
                                  open: true,
                                  user: { ...a },
                                  doctor: a?.doctor?._id
                                })}
                                color="inherit"
                              >
                                <Edit />
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
                      <Typography>No hay pacientes en el sistema</Typography>
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
