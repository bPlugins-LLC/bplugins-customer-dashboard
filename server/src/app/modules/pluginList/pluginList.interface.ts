export interface IPluginList {
  name: string;
  tableName: string;
  permalinks: [string];
  IDs: [string];
  prefix: string;
  icon: {
    svg: string;
    img: string;
  };
  folderName: string;
  versions: [
    {
      enabled: boolean;
      version: string;
      downloadSlug: string;
    }
  ];
  docsURL: string;
  demoURL: string;
}
