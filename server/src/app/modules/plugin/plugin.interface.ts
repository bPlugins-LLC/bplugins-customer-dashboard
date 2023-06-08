interface IPlugin {
  userId: string;
  pluginListId: string;
  name: string;
  productId: string;
  licenseKey: string;
  quantity: number;
  isMarketingAllowed: boolean;
  platform: string;
  icon: {
    svg: string;
    img: string;
  };
}

export default IPlugin;
