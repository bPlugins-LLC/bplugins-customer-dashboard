interface IPlugin {
  userId: string;
  name: string;
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
