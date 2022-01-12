import axios from 'axios';
import { Agent as HttpsAgent } from 'https';
import { Agent as HttpAgent } from 'http';

const instance = axios.create();

if (window == undefined) {
    instance.defaults.httpAgent = new HttpAgent({ keepAlive: true });
    instance.defaults.httpsAgent = new HttpsAgent({ keepAlive: true });
}
export const defaultAxios = axios;
export default instance;
