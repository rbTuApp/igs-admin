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
import { CheckCircleOutlineSharp, Edit, Group, MessageOutlined, MessageSharp, Person, Store } from "@mui/icons-material";
import { consumeGet, URL } from "../utils/constants";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "../context";
import axios from "axios";
import moment from "moment";
import socket from "../utils/Socket";

export default function PQR() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const {
        user,
        logout,
    } = useContext(AuthContext);

    const [selectedAdmin, setSelectedAdmin] = useState({
        open: false,
        chat: null
    });
    const [errors, setErrors] = useState(null);
    const [deleteModalAdmin, setDeleteModalAdmin] = useState(null);
    const handleEraseAdmin = async () => {
        const config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwtToken"),
            },
        };

        const result = await axios.post(
            `${URL}finishChat`,
            { chat: deleteModalAdmin },
            config
        );
        setDeleteModalAdmin(null);
        if (result.status === 200) {
            const filteredAdmins = admins.map((a) => {
                if (a._id !== result.data._id) {
                    return a
                } else {
                    return result.data;
                }
            });
            setAdmins([...filteredAdmins]);
        } else {
            console.log("errors");
        }
    };
    const getNewMessage = async () => {
        try {
            const result = await consumeGet("chatsAdmin", {});

            if (result.status === 200) {
                if (selectedAdmin.open) {
                    const id = selectedAdmin.chat._id;
                    result.data.forEach((p) => {
                        if (id === p._id) {
                            setSelectedAdmin({ ...selectedAdmin, chat: p })
                        }
                    })
                }
                setAdmins(result.data);
            } else {
                console.log(result);
            }
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        socket.on('chat', chat => {
            console.log(chat)
            getNewMessage();
        });

        return () => {
            socket.off();
        };
    }, [user]);
    const uploadAdmin = async () => {
        try {
            setLoading(true);
            const formToSend = {
                message: message,
                type: "ADMIN",
                chat: selectedAdmin.chat._id
            }
            const config = {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwtToken"),
                    "Access-Control-Allow-Origin": "*",
                },
            };

            const result = await axios.post(`${URL}chat`, formToSend, config);
            if (result.status === 200) {
                setErrors(null);
                const arrayAdminds = admins.map((a) => {
                    if (result.data._id === a._id) {
                        return result.data;
                    } else {
                        return a;
                    }
                });
                setSelectedAdmin({ ...selectedAdmin, chat: result.data })
                setAdmins([...arrayAdminds, result.data]);
                setMessage("")
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
                const result = await consumeGet("chatsAdmin", {});

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
        <Box style={{ padding: 12 }}>
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
                            Culminar peticiòn
                        </DialogTitle>
                        <DialogContent>
                            <Typography style={{ marginBottom: 12 }}>
                                ¿Se resolvio exitosamente la peticion del cliente?
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
                {
                    selectedAdmin.open && (

                        <Dialog fullWidth open={selectedAdmin.open}>
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
                                    {selectedAdmin.chat.pacient.first_name + " " + selectedAdmin.chat.pacient.last_name}
                                </DialogTitle>
                                <DialogContent>
                                    <Box style={{ width: "100%" }}>
                                        {selectedAdmin.chat.messages.map((m) => (
                                            <Box style={{ borderWidth: 2, borderStyle: "solid", borderColor: "#1B5A90", padding: 8, borderRadius: 8, marginLeft: m.user ? "18%" : 0, width: "80%", justifyContent: "center", alignItems: m.user ? "flex-end" : "flex-start", marginBottom: 8 }}>
                                                <p style={{ fontSize: 14, fontWeight: "800", color: "#1B5A90", textAlign: m.user ? "right" : "left" }}>{m.message}</p>
                                                <p style={{ fontSize: 12, fontWeight: "800", color: "#6A8693", textAlign: m.user ? "right" : "left" }}>{moment(m.date).fromNow()}</p>
                                            </Box>
                                        ))}
                                    </Box>
                                    <Box style={{ width: "100%", paddingTop: 12 }}>
                                        <TextField
                                            value={message}
                                            placeholder="Mensaje"
                                            fullWidth
                                            onChange={(e) =>
                                                setMessage(e.target.value)
                                            }
                                        />
                                    </Box>
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
                                            Enviar
                                        </Button>
                                    </Fragment>
                                </DialogActions>
                            </Box>
                        </Dialog>
                    )
                }
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
                    <Typography style={{ fontWeight: 800, fontSize: 18, textAlign: "center" }}>PQR Y SOPORTE    </Typography>
                    <Grid style={{ marginTop: 8 }} container>
                        <Grid xs={12}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>Paciente</TableCell>
                                                    <TableCell>Correo</TableCell>
                                                    <TableCell>Asunto</TableCell>
                                                    <TableCell>Tipo</TableCell>
                                                    <TableCell>
                                                        Estado
                                                    </TableCell>
                                                    <TableCell>
                                                        Chatear
                                                    </TableCell>
                                                    <TableCell>
                                                        Completar
                                                    </TableCell>
                                                </TableRow>
                                                {admins.map((a) => (
                                                    <TableRow>
                                                        <TableCell>{a.pacient.first_name + " " + a.pacient.last_name}</TableCell>
                                                        <TableCell>{a.pacient.email}</TableCell>
                                                        <TableCell>{a.asunto}</TableCell>
                                                        <TableCell>{a.type}</TableCell>
                                                        <TableCell>{a.complete ? "RESUELTO" : "ACTIVO"}</TableCell>
                                                        <TableCell>
                                                            <Button
                                                                onClick={() =>
                                                                    setSelectedAdmin({
                                                                        open: true,
                                                                        edit: true,
                                                                        chat: { ...a, password: "" },
                                                                    })
                                                                }
                                                                disabled={a.complete}
                                                                color="inherit"
                                                            >
                                                                <MessageSharp />
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                onClick={() => setDeleteModalAdmin(a._id)}
                                                                color="inherit"
                                                            >
                                                                <CheckCircleOutlineSharp />
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
        </Box>
    );
}
