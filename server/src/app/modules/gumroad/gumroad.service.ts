import axios from "axios";

export const getGumroadSalse = async (email: string) => {
  if (!email) {
    throw new Error("Invalid Request");
  }

  const sales = await getSales({
    access_token: process.env.GUMROAD_ACCESS_TOKEN,
    email,
  });

  return sales;
};

export const getSales = async (params: any, sales = []): Promise<any> => {
  const { data } = await axios.get("https://api.gumroad.com/v2/sales", {
    params,
  });

  if (data.next_page_key) {
    const response = await getSales({ ...params, page_key: data.next_page_key }, data.sales);
    return [...sales, ...response];
  }
  return [...sales, ...data.sales];
};

export default {
  getGumroadSalse,
};
