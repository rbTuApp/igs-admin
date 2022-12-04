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

export default function UserDoctor() {
  const [admins, setAdmins] = useState([]);
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(false);
  const {
    user,
    logout,
  } = useContext(AuthContext);

  const [selectedAdmin, setSelectedAdmin] = useState({
    open: false,
    user: null
  });
  const [errors, setErrors] = useState(null);
  const [deleteModalAdmin, setDeleteModalAdmin] = useState(null);

  useEffect(() => {
    const tryFunct = async () => {
      try {
        const result = await consumeGet("usersDoctor", {});

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
                          <TableCell style={{ textAlign: "center" }}>
                            Informacion
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
