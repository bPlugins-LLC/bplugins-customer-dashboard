import axios from "axios";

class Freemius {
  constructor(scope, id, publicKey, secretKey) {
    this.endpoint = "https://api.freemius.com";
    this._format = "json";
    this.lastUsedEndpoint = "";
    this._scope = scope;
    this.id = id;
    this.publicKey = publicKey;
    this.secretKey = secretKey;
    this.lastUsedHeader = {};
  }

  async generateSignature(secret, stringToSign) {
    const encoder = new TextEncoder();
    const data = encoder.encode(stringToSign);
    const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]);
    const signature = await crypto.subtle.sign("HMAC", key, data);
    const signatureArray = Array.from(new Uint8Array(signature));
    const hex = signatureArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");

    const base64 = btoa(hex);
    return base64.replace(/=/g, "");
  }

  hexToBase64(hex) {
    const bytes = hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16));
    const base64 = btoa(String.fromCharCode.apply(null, bytes));
    return base64;
  }

  generateAuthorizationParams(resourceUrl, method = "GET", jsonEncodedParams = "", contentType = "") {
    method = method.toUpperCase();

    const eol = "\n";
    let contentMd5 = "";
    const now = Math.floor(Date.now() / 1000) + 0;
    const date = new Date(now * 1000).toUTCString().replace("GMT", "+0000");
    const stringToSign = [method, contentMd5, contentType, date, resourceUrl].join(eol);
    const authType = this.secretKey !== this.publicKey ? "FS" : "FSP";
    let signature = this.generateSignature(this.secretKey, stringToSign);

    const auth = {
      date,
      authorization: `${authType} ${this.id}:${this.publicKey}:${signature}`,
    };

    return auth;
  }

  async generateAuthorizationHeader(resourceUrl, method = "GET", jsonEncodedParams = "", contentType = "") {
    method = method.toUpperCase();

    const id = resourceUrl.match(/\d{3,}/)?.[0];
    const eol = "\n";
    let contentMd5 = "";
    const now = Math.floor(Date.now() / 1000) + 0;
    // const date = new Date(now * 1000).toUTCString().replace("GMT", "+0000");
    const date = "Fri, 09 Jun 2023 18:41:38 +0000";
    const stringToSign = [method, contentMd5, contentType, date, resourceUrl].join(eol);
    let signature = await this.generateSignature(this.secretKey, stringToSign);
    const authType = this.secretKey !== this.publicKey ? "FS" : "FSP";
    const auth = {
      date,
      Authorization: `${authType} ${id}:${this.publicKey}:${signature}`,
    };

    this.lastUsedHeader = auth;
    return auth;
  }

  canonizePath(pPath) {
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
    switch (this._scope) {
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

  async getLicense(pluginId, licenseId) {
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

  async makeRequest(path, config = {}) {
    const canonizePath = this.canonizePath(path);
    this.lastUsedEndpoint = this.endpoint + canonizePath;
    try {
      const response = await axios.get(this.endpoint + canonizePath, {
        headers: this.generateAuthorizationHeader(canonizePath.split("?")?.[0]),
        // ...config,
      });
      return response.data;
    } catch (error) {
      return error;
    }
  }

  async makeRawRequest(path, headers = {}) {
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

  async getTags(id) {
    const path = `/plugins/${id}/tags.json`;
    return await this.makeRequest(path);
  }

  async getDownloadLink(data, headers = {}) {
    const { pluginId, tagId } = data;
    const path = `/plugins/${pluginId}/tags/${tagId}.zip?is_premium=true`;
    return await this.makeRawRequest(path, headers);
  }
}

export default Freemius;
