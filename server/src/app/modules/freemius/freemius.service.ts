import FreemiusApi from "../../../lib/Freemius";

export const getCollectionById = () => {};

export const getFreemiusUser = async (plugin_id: number, freemiusUserId: number, fields: string) => {
  const api = new FreemiusApi("developer", process.env.DEVELOPER_ID, process.env.PUBLIC_KEY, process.env.SECRET_KEY);
  return await api.makeRequest(`/plugins/${plugin_id}/users/${freemiusUserId}.json?fields=${fields}`);
};

export default { getFreemiusUser };
