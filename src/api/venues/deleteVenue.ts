import { API_VENUES } from '../api';

export const deleteVenue = async (id: string, token: string) => {
  const response = await fetch(`${API_VENUES}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 204) {
    // TODO add toast
    console.log(`Deleted venue ${id} successfully.`);
  } else {
    console.error(`Could not delete venue. ${response.status}`);
  }

  return response.status === 204;
};
