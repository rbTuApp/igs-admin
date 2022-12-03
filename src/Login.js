import React, { Fragment, memo, useContext, useState } from "react";
import { Box, Button, FormLabel, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { AuthContext } from "./context";
import { URL } from "./utils/constants";

const styles = (theme) => ({
  box: {
    height: "100vh",
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: theme.palette.primary.main,
  },
});
const Login = (props) => {
  const { login } = useContext(AuthContext);
  const { classes } = props;
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
    email: "",
    logged: false,
    errors: null,
  });
  const handleLogin = async () => {
    const params = {
      email: values.email,
      password: values.password,
    };
    const result = await axios
      .post(`${URL}loginAdmin`, params)
      .catch((err) =>
        setValues({ ...values, errors: err.response.data.errors })
      );
    try {
      if (result.status === 200) {
        console.log("LOGGED?", result.data);
        login(result.data);
      } else {
        setValues({ ...values, errors: result.data.errors });
      }
    } catch (err) {
      console.log(err.response);
    }
  };
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  if (values.errors) {
    console.log(values.errors);
  }
  return (
    <Box className={classes.box}>
      {values.errors && (
        <Dialog
          open={true}
          onClose={() => setValues({ ...values, errors: null })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Error al iniciar sesión"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {Object.values(values.errors).map((v) => (
                <Typography>* {v}</Typography>
              ))}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setValues({ ...values, errors: null })}>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Card style={{ padding: 12, borderRadius: 18, width: "40%" }}>
        {values.logged ? (
          <CardContent>
            <Typography>Logged!</Typography>
          </CardContent>
        ) : (
          <Fragment>
            <CardContent>
              <InputLabel htmlFor="Email" style={{ marginBottom: 8 }}>
                Correo
              </InputLabel>
              <TextField
                id="Email"
                value={values.email}
                onChange={(ev) =>
                  setValues({ ...values, email: ev.target.value })
                }
                style={{ width: "100%", marginBottom: 18 }}
                variant="outlined"
              />
              <InputLabel htmlFor="password" style={{ marginBottom: 8 }}>
                Contraseña
              </InputLabel>
              <OutlinedInput
                id="password"
                value={values.password}
                onChange={(ev) =>
                  setValues({ ...values, password: ev.target.value })
                }
                style={{ width: "100%" }}
                variant="outlined"
                type={values.showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </CardContent>
            <CardActions
              style={{
                justifyContent: "flex-end",
                alignItems: "flex-end",
                display: "flex",
              }}
            >
              <Button
                style={{ marginRight: 8 }}
                onClick={handleLogin}
                variant="contained"
              >
                Iniciar sesión
              </Button>
            </CardActions>
          </Fragment>
        )}
      </Card>
    </Box>
  );
};

export default withStyles(styles, { withTheme: true })(memo(Login));
