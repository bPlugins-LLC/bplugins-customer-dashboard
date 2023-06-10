interface IFreemius {
  id: number;
  pluginId: string;
  freemiusPluginId: string;
  userId: string;
  licenseId: string;
  publicKey: string;
  isLive: boolean;
  expiration: string;
  isCancelled: boolean;
}

export default IFreemius;
