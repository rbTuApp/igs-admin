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
import { AssignmentLate, Edit, Group, Person, SettingsInputCompositeSharp, Store, UploadFile } from "@mui/icons-material";
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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DoneIcon from '@mui/icons-material/Done';
import AgoraUIKit from "agora-react-uikit";
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

export default function Reserves() {
  const [admins, setAdmins] = useState([]);
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(false);
  const [reunion, setReunion] = useState(null)
  const [finish, setFinish] = useState(null)
  const {
    user,
    logout,
    setReunion: InnerReunion
  } = useContext(AuthContext);

  const [selectedAdmin, setSelectedAdmin] = useState({
    open: false,
    user: null
  });
  const [errors, setErrors] = useState(false);
  const [sucess, setSucess] = useState(false)
  const [sucess2, setSucess2] = useState(false)
  const [deleteModalAdmin, setDeleteModalAdmin] = useState(null);
  const initReservation = async (id) => {
    try {

      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwtToken"),
          "Access-Control-Allow-Origin": "*",
        },
      };
      const result = await axios.post(URL + "initReserve", {
        reserve: id
      }, config);
      if (result.status === 200) {
        setErrors(false)
        setSucess(true)
        const filtered = admins.filter((a) => a._id !== result.data._id)
        setAdmins([result.data, ...filtered])
      } else {
        setErrors(true)
      }
    } catch (err) {
      setErrors(true)
    }
  }
  const finishReservation = async () => {
    try {

      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwtToken"),
          "Access-Control-Allow-Origin": "*",
        },
      };
      const result = await axios.post(URL + "finishReserve", {
        reserve: finish
      }, config);
      if (result.status === 200) {
        setErrors(false)
        setFinish(null)
        setSucess2(true)
        const filtered = admins.filter((a) => a._id !== result.data._id)
        setAdmins([...filtered])
      } else {
        setErrors(true)
      }
    } catch (err) {
      setErrors(true)
    }
  }
  const callbacks = {
    EndCall: () => {
      setReunion(null)
      InnerReunion(false)
    },
  }
  useEffect(() => {
    const tryFunct = async () => {
      try {
        const result = await consumeGet("reservesDoctor/" + user.id, {});

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
    <Fragment>
      {
        reunion ? (
          <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
            <AgoraUIKit rtcProps={{ appId: "d6b95c05250346a1bd85b4035864b2bc", channel: reunion.channel, token: reunion.token }} callbacks={callbacks} />
          </div>
        ) :
          (
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Box>
                {
                  sucess && (

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
                          Exitoso
                        </DialogTitle>
                        <DialogContent>
                          <Typography>La sala de la reunion se creo exitosamente</Typography>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            color="inherit"
                            onClick={() => {
                              setSucess(false)
                              setErrors(null);
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
                {
                  sucess2 && (

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
                          Exitoso
                        </DialogTitle>
                        <DialogContent>
                          <Typography>La reserva fue culminada con exito</Typography>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            color="inherit"
                            onClick={() => {
                              setSucess2(false)
                              setErrors(null);
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
                {
                  finish && (

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
                          ¿Estas seguro?
                        </DialogTitle>
                        <DialogContent>
                          <Typography style={{textAlign: "center"}}>Al confirmar daras por terminada la reservacion concluyendo en que se realizo con exito</Typography>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            color="inherit"
                            onClick={() => {
                              setFinish(null);
                              setSucess(false);
                              setErrors(null);
                            }}
                            variant="contained"
                            disabled={loading}
                            style={{ width: "49%", marginRight: 4 }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            style={{ width: "49%" }}
                            variant="contained"
                            component="label"
                            disabled={loading}
                            onClick={finishReservation}
                          >
                            Confirmar
                          </Button>
                        </DialogActions>
                      </Box>
                    </Dialog>
                  )
                }
                {
                  errors && (

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
                          Error
                        </DialogTitle>
                        <DialogContent>
                          <Typography>Ha ocurrido un error en la solicitud</Typography>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            color="inherit"
                            onClick={() => {
                              setSucess(false)
                              setErrors(null);
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
                <Typography style={{ fontWeight: 800, fontSize: 18, textAlign: "center" }}>Reservas</Typography>
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
                                  <TableCell>Fecha y hora</TableCell>
                                  <TableCell style={{ textAlign: "center" }}>
                                    Iniciar Reunion
                                  </TableCell>
                                  <TableCell style={{ textAlign: "center" }}>
                                    Entrar
                                  </TableCell>
                                  <TableCell style={{ textAlign: "center" }}>
                                    Terminar Reunion
                                  </TableCell>
                                </TableRow>
                                {admins.map((a) => (
                                  <TableRow>
                                    <TableCell>{a.pacient.first_name}</TableCell>
                                    <TableCell>{a.pacient.last_name}</TableCell>
                                    <TableCell>{a.pacient.document}</TableCell>
                                    <TableCell>{a.pacient.pathology}</TableCell>
                                    <TableCell>{a.date + " " + a.time}</TableCell>
                                    <TableCell style={{ textAlign: "center" }}>
                                      <Button
                                        onClick={() =>
                                          initReservation(a._id)
                                        }
                                        color="inherit"
                                      >
                                        <PlayArrowIcon />
                                      </Button>
                                    </TableCell>
                                    <TableCell style={{ textAlign: "center" }}>
                                      <Button
                                        onClick={() => {
                                          setReunion({
                                            channel: a._id,
                                            token: a.link,
                                          })
                                          InnerReunion(true)
                                        }
                                        }
                                        color="inherit"
                                        disabled={!a.link}
                                      >
                                        <ExitToAppIcon />
                                      </Button>
                                    </TableCell>
                                    <TableCell style={{ textAlign: "center" }}>
                                      <Button
                                        onClick={() =>
                                          setFinish(a._id)
                                        }
                                        color="inherit"
                                        disabled={!a.link}
                                      >
                                        <DoneIcon />
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
                              <Typography>No hay reservas pendientes</Typography>
                            </Box>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box >
            </LocalizationProvider >
          )}
    </Fragment>
  );
}
