import axios from 'axios';
import http from 'http';
import https from 'https';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api/v1',
    httpAgent: new http.Agent({keepAlive: false}),
    httpsAgent: new https.Agent({keepAlive: false}),
});

export default api;
