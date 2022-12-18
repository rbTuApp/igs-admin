import io from 'socket.io-client';
import { URL } from './constants';

let socket = io(URL);

export default socket;