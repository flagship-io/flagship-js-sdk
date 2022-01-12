import axios from 'axios';

const instance = axios.create();

if (typeof window === 'undefined') {
    const { Agent: HttpsAgent } = require('https');
    const { Agent: HttpAgent } = require('http');
    instance.defaults.httpAgent = new HttpAgent({ keepAlive: true });
    instance.defaults.httpsAgent = new HttpsAgent({ keepAlive: true });
}
export const defaultAxios = axios;
export default instance;
