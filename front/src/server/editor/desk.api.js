import homeApi from "../home/home.api";

export const getDesksByFloor = async (floorId) => {
  const res = await homeApi.get(`/desk/by-floor/${floorId}`);
  return res.data;
};

export const getDeskById = async (id) => {
  const res = await homeApi.get(`/desk/${id}`);
  return res.data;
};

export const createDesk = async (deskDto) => {
  const res = await homeApi.post(`/desk/create`, deskDto);
  return res.data;
};

export const updateDesk = async (deskDto) => {
  const res = await homeApi.put(`/desk/update`, deskDto);
  return res.data;
};

export const deleteDesk = async (id) => {
  const res = await homeApi.delete(`/desk/delete/${id}`);
  return res.data;
};
