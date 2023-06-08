import crypto from "crypto";
import axios from "axios";

class Freemius {
  private endpoint = "https://api.freemius.com";
  private _format = "json";
  constructor(private _scope: String, private id: string | number | undefined, private publicKey: string | undefined, private secretKey: string | undefined) {}

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
        base = "/apps/" + 6519;
        break;
      case "developer":
        base = "/developers/" + 6519;
        break;
      case "store":
        base = "/stores/" + 6519;
        break;
      case "user":
        base = "/users/" + 6519;
        break;
      case "plugin":
        base = "/plugins/" + 6519;
        break;
      case "install":
        base = "/installs/" + 6519;
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

  async makeRequest(path: string) {
    const canonizePath = this.canonizePath(path);
    // return canonizePath;
    console.log(canonizePath);
    try {
      const { data } = await axios.get(this.endpoint + canonizePath, {
        headers: this.generateAuthorizationHeader(canonizePath.split("?")?.[0]),
      });
      return data;
    } catch (error) {
      return error;
    }
  }

  async getTags(id: string | number) {
    const path = `/plugins/${id}/tags.json`;
    return this.makeRequest(path);
  }
}

export default Freemius;
