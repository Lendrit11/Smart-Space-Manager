import homeApi from "./home.api";

// GET ALL BUILDINGS (Admin)
export const getAllBuildings = async () => {
  try {
    console.log("Calling GET /building/get-all...");
    const res = await homeApi.get("/building/get-all");
    console.log("Response from backend:", res); // 🔹 shiko të gjithë objektin
    return res.data;
  } catch (error) {
    if (error.response) {
      console.error("Backend responded with status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    throw error;
  }
};

// CREATE BUILDING (Admin)
export const createBuilding = async (payload) => {
  try {
    console.log("Sending payload to backend:", payload); // 🔹 Shiko çfarë po dërgohet
    const res = await homeApi.post("/building/create", payload);
    console.log("Response from backend:", res.data); // 🔹 Shiko çfarë kthehet
    return res.data;
  } catch (error) {
    // 🔹 Axios i jep info të ndryshme në error.response
    if (error.response) {
      console.error("Backend responded with status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    throw error; // rishpërndaj error-in te frontend për të kapur në component
  }
};


// DELETE BUILDING (Admin)
export const deleteBuilding = async (id) => {
  const res = await homeApi.delete(`/building/delete/${id}`);
  return res.data;
};
