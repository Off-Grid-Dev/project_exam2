import { getVenues } from './venues/getVenues';
import { getVenueByID } from './venues/getVenueByID';
const API_BASE = import.meta.env.VITE_API_BASE;
export const API_VENUES = `${API_BASE}venues`;
// const API_PROFILES = `${API_BASE}/profiles/`;
// const API_BOOKINGS = `${API_BASE}/bookings/`;

type FetchParams = {
  options?: RequestInit;
  sort?: string;
  sortOrder?: string;
  limit?: number;
  offset?: number;
  _owner?: boolean;
  _bookings?: boolean;
  id?: string;
  query?: string;
};

const getData = (fn: string, params?: FetchParams) => {
  console.log(`Function called: ${fn}`);
  switch (fn) {
    case 'get venues': {
      const { sort, sortOrder, limit, offset } = params || {};
      return getVenues(sort, sortOrder, limit, offset).then((res) =>
        console.log(res),
      );
    }
    case 'venue by id': {
      const { id } = params || {};
      return getVenueByID(id).then((res) => console.log(res));
    }
  }
};

export { getData };
