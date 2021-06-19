import { Network } from "../utils/network";

export namespace API {
  export function requestHello() {
    return Network.buildRequest(false).send("", Network.HttpMethod.GET);
  }

  
}
