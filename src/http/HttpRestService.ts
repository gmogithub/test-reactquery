import { ApiResponseError } from "./error/ApiResponseError";
import { ApiResponse } from "./response/ApiResponse";

export type HttpMiddleware = (httpRest: HttpRestService, response: ApiResponse | null, ...args: Array<any>) => any;


export enum HttpMethodEnum {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

export enum HttpActionEnum {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  UPLOAD = "UPLOAD",
  DOWNLOAD = "DOWNLOAD",
  LOAD = "LOAD"
}

export class HttpRestService {
  static HEADERS_JSON = () => new Headers({
    'Content-Type': 'application/json;charset=UTF-8'
  });

  static HEADERS_UPLOAD = () => new Headers();
  static HEADERS_DOWNLOAD = () => new Headers();
  static HEADERS_LOAD = () => new Headers();

  private middlewareBefore: Array<HttpMiddleware> = [];
  private middlewareSuccess: Array<HttpMiddleware> = [];
  private middlewareError: Array<HttpMiddleware> = [];
  private middlewareAfter: Array<HttpMiddleware> = [];
  private baseUrl: string = '';
  public headers: Headers = HttpRestService.HEADERS_JSON();
  private generateApiResponse: boolean = false;


  setGenerateApiResponse(value: boolean) {
    this.generateApiResponse = value;
  }

  public setHeaders(headers: Headers) {
    this.headers = headers;
  }

  public setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public setMiddlewareBefore(middlewareList: Array<HttpMiddleware>): void {
    this.middlewareBefore = middlewareList;
  }

  public setMiddlewareSuccess(middlewareList: Array<HttpMiddleware>): void {
    this.middlewareSuccess = middlewareList;
  }

  public setMiddlewareError(middlewareList: Array<HttpMiddleware>): void {
    this.middlewareError = middlewareList;
  }

  public setMiddlewareAfter(middlewareList: Array<HttpMiddleware>): void {
    this.middlewareAfter = middlewareList;
  }

  public get<T = any>(api: string): Promise<ApiResponse<T>> {
    return this.send<T>(api, HttpActionEnum.GET);
  }

  public post<T = any>(api: string, body?: any): Promise<ApiResponse<T>> {
    return this.send<T>(api, HttpActionEnum.POST, body);
  }

  public put<T = any>(api: string, body?: any): Promise<ApiResponse<T>> {
    return this.send<T>(api, HttpActionEnum.PUT, body);
  }

  public delete<T = any>(api: string, body?: any): Promise<ApiResponse<T>> {
    return this.send<T>(api, HttpActionEnum.DELETE, body);
  }

  public upload<T = any>(api: string, body?: any): Promise<ApiResponse<T>> {
    return this.send<T>(api, HttpActionEnum.UPLOAD, body);
  }

  public download<T = any>(api: string): Promise<ApiResponse<T>> {
    return this.send<T>(api, HttpActionEnum.DOWNLOAD);
  }

  public load<T = any>(api: string): Promise<ApiResponse<T>> {
    return this.send<T>(api, HttpActionEnum.LOAD);
  }

  private async checkStatus(response: Response, api: String, method: String, body: any) {
    const contentType = response.headers.get('Content-Type');
    const isJson = contentType !== null && contentType.indexOf("application/json") > -1;
    let resJson = isJson ? await response.json() : response;
    let apiResponse: ApiResponse;

    if (this.generateApiResponse) {
      if (isJson) {
        apiResponse = ApiResponse.newInstanceByResponseJson(response, resJson);
      } else {
        apiResponse = ApiResponse.newInstanceByResponse(response);
      }
    } else {
      if (isJson) {
        apiResponse = ApiResponse.newInstanceByResponseJsonType(resJson);
      } else {
        apiResponse = ApiResponse.newInstanceByResponse(response);
      }
    }
    if (response.ok) {
      resJson = await this.launchMiddleware(this.middlewareSuccess, apiResponse, api, method, body);
    } else {
      throw new ApiResponseError(apiResponse, resJson.message);
    }
    return resJson;
  }

  private async launchMiddleware(middlewareList: Array<HttpMiddleware>, res: ApiResponse | null, ...args: Array<any>): Promise<any> {
    for (const middleware of middlewareList) {
      try {
        res = await middleware(this, res, ...args);
      } catch (e) {
        console.error(e);
      }
    }
    return res;
  }

  private buildUrl(api: string) {
    if (!api.startsWith('/')) {
      api = `/${api}`;
    }
    return `${this.baseUrl}${api}`;
  }

  private async send<T = any>(api: string, action: HttpActionEnum, body: any = null): Promise<ApiResponse<T>> {
    const headers = this.getHeader(action);
    this.headers = headers;
    const method: HttpMethodEnum = HttpRestService.getMethodByAction(action);
    const init = {
      method,
      headers,
      body: null
    };

    await this.launchMiddleware(this.middlewareBefore, null, api, method, body);
    if (body != null) {
      if (body instanceof Object)
        init.body = action === HttpActionEnum.UPLOAD ? body : JSON.stringify(body);
      else
        init.body = body;
    }
    const url = this.buildUrl(api);

    return fetch(url, init)
      .then((res) => this.checkStatus(res, api, method, body))
      .catch(async (error) => {
        return await this.launchMiddleware(this.middlewareError, error.response, error, api, method, body);
      }).finally(async () => {
        return await this.launchMiddleware(this.middlewareAfter, null, api, method, body)
      });
  }

  private getHeader(action: HttpActionEnum): Headers {
    if (this.headers !== null) {
      return this.headers;
    }
    switch (action) {
      case HttpActionEnum.UPLOAD:
        return HttpRestService.HEADERS_UPLOAD();
      case HttpActionEnum.DOWNLOAD:
        return HttpRestService.HEADERS_DOWNLOAD();
      case HttpActionEnum.LOAD:
        return HttpRestService.HEADERS_LOAD();
      case HttpActionEnum.GET:
      case HttpActionEnum.POST:
      case HttpActionEnum.PUT:
      case HttpActionEnum.DELETE:
        return HttpRestService.HEADERS_JSON();
      default:
        return HttpRestService.HEADERS_JSON();
    }
  }

  private static getMethodByAction(action: HttpActionEnum): HttpMethodEnum {
    switch (action) {
      case HttpActionEnum.UPLOAD:
      case HttpActionEnum.POST:
        return HttpMethodEnum.POST;
      case HttpActionEnum.DOWNLOAD:
      case HttpActionEnum.LOAD:
      case HttpActionEnum.GET:
        return HttpMethodEnum.GET;
      case HttpActionEnum.DELETE:
        return HttpMethodEnum.DELETE;
      case HttpActionEnum.PUT:
        return HttpMethodEnum.PUT;
      default:
        return HttpMethodEnum.GET;
    }
  }
}