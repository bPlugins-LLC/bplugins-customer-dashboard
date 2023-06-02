import crypto from "crypto";
import axios from "axios";

class Freemius {
  private endpoint = "https://api.freemius.com";
  constructor(private scope: String, private id: string | number | undefined, private publicKey: string | undefined, private secretKey: string | undefined) {}

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

  async getLicense(path: string) {
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
    try {
      const { data } = await axios.get(this.endpoint + path, {
        headers: this.generateAuthorizationHeader(path),
      });
      return data;
    } catch (error) {
      return error;
    }
  }
}

export default Freemius;
