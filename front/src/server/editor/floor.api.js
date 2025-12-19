import homeApi from "../home/home.api"; // importo instancën e axios

export const getFloorsByBuilding = async (buildingId) => {
  const res = await homeApi.get(`/floor/by-building/${buildingId}`);
  return res.data;
};

export const createFloor = async (dto) => {
  const res = await homeApi.post(`/floor/create`, dto);
  return res.data;
};

export const deleteFloor = async (id) => {
  await homeApi.delete(`/floor/delete/${id}`);
};
