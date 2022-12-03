import io from "socket.io-client";
import { URL } from "../utils/constants";
let socket = io(URL);

export default socket;
