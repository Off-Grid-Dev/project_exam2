import { getVenues } from './venues/getVenues';
import { getVenueByID } from './venues/getVenueByID';
import { getVenueBySearch } from './venues/getVenueBySearch';
const API_BASE = import.meta.env.VITE_API_BASE;
export const API_VENUES = `${API_BASE}venues`;
// const API_PROFILES = `${API_BASE}/profiles/`;
// const API_BOOKINGS = `${API_BASE}/bookings/`;

type FetchParams = {
  options?: RequestInit;
  sort?: string;
  sortOrder?: string;
  limit?: number;
  page?: number;
  _owner?: boolean;
  _bookings?: boolean;
  id?: string;
  q?: string;
};

const getData = (fn: string, params?: FetchParams) => {
  console.log(`Function called: ${fn}`);
  switch (fn) {
    case 'get venues': {
      const { sort, sortOrder, limit, page } = params || {};
      return getVenues(sort, sortOrder, limit, page).then((res) =>
        console.log(res),
      );
    }
    case 'venue by id': {
      const { id } = params || {};
      return getVenueByID(id).then((res) => console.log(res));
    }
    case 'venue by search': {
      const { sort, sortOrder, limit, page, q } = params || {};
      return getVenueBySearch(sort, sortOrder, limit, page, q).then((res) =>
        console.log(res),
      );
    }
  }
};

export { getData };
