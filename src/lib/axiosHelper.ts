import axios from 'axios';
import { Agent as HttpsAgent } from 'https';
import { Agent as HttpAgent } from 'http';

const instance = axios.create({
    httpAgent: new HttpAgent({ keepAlive: true }),
    httpsAgent: new HttpsAgent({ keepAlive: true })
});

export const defaultAxios = axios;
export default instance;
