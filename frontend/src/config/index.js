import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://linkedin-e8p7.onrender.com';

export const clientServer = axios.create({
    baseURL: BASE_URL,
});