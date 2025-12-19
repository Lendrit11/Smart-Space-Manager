import homeApi from "../home/home.api";

export const getSeatsByDesk = async (deskId) => {
  const res = await homeApi.get(`/seat/by-desk/${deskId}`);
  return res.data;
};

export const getSeatById = async (id) => {
  const res = await homeApi.get(`/seat/${id}`);
  return res.data;
};

export const createSeat = async (seatDto) => {
  const res = await homeApi.post(`/seat/create`, seatDto);
  return res.data;
};

export const updateSeat = async (seatDto) => {
  const res = await homeApi.put(`/seat/update`, seatDto);
  return res.data;
};

export const deleteSeat = async (id) => {
  const res = await homeApi.delete(`/seat/delete/${id}`);
  return res.data;
};
