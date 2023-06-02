interface IGumroad {
  pluginId: string;
  productId: string;
  permalink: string;
  saleId: string;
  refunded: boolean;
  variants: string;
  versions: string[];
  saleTimestamp: string;
  orderNumber: number;
}

export default IGumroad;
