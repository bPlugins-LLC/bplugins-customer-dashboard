import crypto from "crypto";
import axios from "axios";

class Freemius {
  private endpoint = "https://api.freemius.com";
  private _format = "json";
  public lastUsedEndpoint: string = "";
  public lastUsedHeader: any = {};
  constructor(private _scope: String, private id: number | string | undefined, private publicKey: string, private secretKey: string) {}

  generateSignature(secret: string, stringToSign: string) {
    const hmac = crypto.createHmac("sha256", secret);
    const bash = hmac.update(stringToSign).digest("hex");
    return Buffer.from(bash).toString("base64").replaceAll("=", "");
  }

  generateAuthorizationParams(resourceUrl: string, method: string = "GET", jsonEncodedParams: string = "", contentType: string = "") {
    method = method.toUpperCase();

    const eol = "\n";
    let contentMd5 = "";
    const now = Math.floor(Date.now() / 1000) + 0;
    const date = new Date(now * 1000).toUTCString().replace("GMT", "+0000");
    const stringToSign = [method, contentMd5, contentType, date, resourceUrl].join(eol);
    const authType = this.secretKey !== this.publicKey ? "FS" : "FSP";
    let signature = this.generateSignature(this.secretKey as string, stringToSign);

    const auth = {
      date,
      authorization: `${authType} ${this.id}:${this.publicKey}:${signature}`,
    };

    // if (contentMd5 !== "") {
    //   auth.content_md5 = contentMd5;
    // }
    return auth;
  }

  generateAuthorizationHeader(resourceUrl: string, method: string = "GET", jsonEncodedParams: string = "", contentType: string = "") {
    method = method.toUpperCase();

    const id = resourceUrl.match(/\d{3,}/)?.[0];
    const eol = "\n";
    let contentMd5 = "";
    const now = Math.floor(Date.now() / 1000) + 0;
    const date = new Date(now * 1000).toUTCString().replace("GMT", "+0000");
    const stringToSign = [method, contentMd5, contentType, date, resourceUrl].join(eol);
    let signature = this.generateSignature(this.secretKey as string, stringToSign);
    const authType = this.secretKey !== this.publicKey ? "FS" : "FSP";
    const auth = {
      date,
      Authorization: `${authType} ${id}:${this.publicKey}:${signature}`,
    };

    // if (contentMd5 !== "") {
    //   auth.content_md5 = contentMd5;
    // }
    return auth;
  }

  canonizePath(pPath: string) {
    pPath = pPath.trim().replace(/^\/+|\/+$/g, "");
    const queryPos = pPath.indexOf("?");
    let query = "";

    if (queryPos !== -1) {
      query = pPath.substring(queryPos);
      pPath = pPath.substring(0, queryPos);
    }

    const formatLength = ("." + this._format).length;
    const start = -formatLength * -1;
    if (pPath.toLowerCase().slice(start) === "." + this._format) {
      pPath = pPath.slice(0, pPath.length - 4);
    }

    let base;
    switch (this._scope as string) {
      case "app":
        base = "/apps/" + this.id;
        break;
      case "developer":
        base = "/developers/" + this.id;
        break;
      case "store":
        base = "/stores/" + this.id;
        break;
      case "user":
        base = "/users/" + this.id;
        break;
      case "plugin":
        base = "/plugins/" + this.id;
        break;
      case "install":
        base = "/installs/" + this.id;
        break;
      default:
        throw new Error("Scope not implemented.");
    }

    return "/v" + 1 + base + (pPath !== "" ? "/" : "") + pPath + (pPath.indexOf(".") === -1 ? "." + this._format : "") + query;
  }

  async getLicense(pluginId: string | number, licenseId: string | number) {
    const path = `/plugins/${pluginId}/licenses/${licenseId}.json`;
    try {
      const { data } = await axios.get(this.endpoint + `/v1/developers/${this.id}` + path, {
        headers: this.generateAuthorizationParams(`/v1/developers/${this.id}` + path),
      });
      return data;
    } catch (error) {
      return error;
    }
  }

  async makeRequest(path: string, headers: any = {}) {
    const canonizePath = this.canonizePath(path);
    this.lastUsedEndpoint = this.endpoint + canonizePath;
    this.lastUsedHeader = this.generateAuthorizationHeader(canonizePath.split("?")?.[0]);
    try {
      const response = await axios.get(this.endpoint + canonizePath, {
        headers: {
          ...this.lastUsedHeader,
          ...headers,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  }

  async makeRawRequest(path: string, headers: any = {}) {
    const canonizePath = this.canonizePath(path);
    try {
      const response = await axios.get(this.endpoint + canonizePath, {
        headers: {
          ...this.generateAuthorizationHeader(canonizePath.split("?")?.[0]),
          ...headers,
        },
      });
      return response;
    } catch (error) {
      return error;
    }
  }

  async getTags(id: string | number): Promise<any> {
    const path = `/plugins/${id}/tags.json`;
    return await this.makeRequest(path);
  }

  async getDownloadLink(data: { pluginId: string | number; tagId: string | number }, headers: any = {}): Promise<any> {
    const { pluginId, tagId } = data;
    const path = `/plugins/${pluginId}/tags/${tagId}.zip?is_premium=true`;
    // return this.generateAuthorizationHeader(path.split("?")?.[0]);
    return await this.makeRawRequest(path, headers);
  }

  async getAccessToken() {
    return await this.makeRequest("token.json");
  }

  async getInstalls(pluginId: string | number) {
    return await this.makeRequest(`/plugins/${pluginId}/installs.json?search&reason_id&fields=id,url,version,title,is_active,user_id,plugin_id,license_id&count=30`);
  }

  async deleteInstall(pluginId: string | number, install_id: number | string) {
    const path = `/plugins/${pluginId}/installs/${install_id}.json`;
    const canonizePath = this.canonizePath(path);
    this.lastUsedHeader = this.generateAuthorizationHeader(canonizePath.split("?")?.[0]);
    try {
      const response = await axios.delete(this.endpoint + canonizePath, {
        headers: this.lastUsedHeader,
      });
      return response.data;
    } catch (error: any) {
      return error.message;
    }
  }
}

export default Freemius;
