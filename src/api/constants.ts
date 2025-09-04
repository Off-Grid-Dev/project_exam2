const API_BASE = import.meta.env.VITE_API_BASE;
const API_HOLIDAZE = import.meta.env.VITE_API_HOLIDAZE;
export const API_VENUES = `${API_HOLIDAZE}venues`;
export const API_REGISTER = `${API_BASE}auth/register`;
export const API_LOGIN = `${API_BASE}auth/login`;
export const API_PROFILES = `${API_HOLIDAZE}profiles`;
export const API_BOOKINGS = `${API_HOLIDAZE}bookings`;
// TO DO implement github action injection of this key
export const API_KEY = import.meta.env.VITE_API_KEY;
