import axios from 'axios';

const instance = axios.create({});

if (typeof window === 'undefined') {
    const { Agent: HttpAgent } = require('http');
    const { Agent: HttpAgents } = require('https');
    instance.defaults.httpAgent = new HttpAgent({ keepAlive: true });
    instance.defaults.httpsAgent = new HttpAgents({ keepAlive: true });
}

export const defaultAxios = axios;
export default instance;
