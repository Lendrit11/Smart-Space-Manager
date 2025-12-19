import homeApi from "./home.api";

// GET FLOORS BY BUILDING
export const getFloorsByBuilding = async (buildingId) => {
  const res = await homeApi.get(`/floor/by-building/${buildingId}`);
  return res.data;
};

// CREATE FLOOR
export const createFloor = async (payload) => {
  /*
    payload:
    {
      buildingId,
      floorNumber,
      description,
      width,
      height,
      scale
    }
  */
  const res = await homeApi.post("/floor/create", payload);
  return res.data;
};

// DELETE FLOOR
export const deleteFloor = async (id) => {
  const res = await homeApi.delete(`/floor/delete/${id}`);
  return res.data;
};
