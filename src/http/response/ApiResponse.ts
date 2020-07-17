export type ResponseJsonType = {
  success: boolean,
  message: string,
  payload: any,
  code: number | string,
  status: number,
  blob: any
}

export class ApiResponse<T = any> {
  private _success: boolean = true;
  private _message: string = "Auncun message";
  private _payload: T | null = null;
  private _code: number | string = 200;
  private _status: number = 200;
  private _blob: any;

  private constructor() {
  }

  public static newInstanceByResponseJson(response: Response, json: any) : ApiResponse {
    const apiResponse: ApiResponse = new ApiResponse();
    apiResponse._success = response.ok;
    apiResponse._code = response.status;
    apiResponse._payload = json;
    apiResponse._message = "";
    apiResponse._status = response.status;
    return apiResponse;
  }

  public static newInstanceByResponseJsonType(json: ResponseJsonType): ApiResponse {
    const apiResponse: ApiResponse = new ApiResponse();
    apiResponse._success = json.success;
    apiResponse._code = json.code;
    apiResponse._payload = json.payload;
    apiResponse._message = json.message;
    apiResponse._status = json.status;
    apiResponse._blob = json.blob;
    return apiResponse;
  }

  public static newInstanceByResponse(response: Response) {
    const apiResponse: ApiResponse = new ApiResponse();
    apiResponse._success = response.ok;
    apiResponse._code = response.status;
    apiResponse._payload = response;
    apiResponse._message = "";
    apiResponse._status = response.status;
    apiResponse._blob = response.blob;
    return apiResponse;
  }

  public static error(message: string = "error") {
    const apiResponse: ApiResponse = new ApiResponse();
    apiResponse._status = 400;
    apiResponse._code = 400;
    apiResponse._message = message;
    apiResponse._success = false;
    return apiResponse;
  }


  public get success(): boolean {
    return this._success;
  }

  public get message(): string {
    return this._message;
  }

  public get payload(): T {
    return this._payload as T;
  }

  public get code(): number | string {
    return this._code;
  }

  public get status(): number {
    return this._status;
  }

  public get blob(): any {
    return this._blob;
  }
}
