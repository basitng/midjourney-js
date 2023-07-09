import * as fs from "fs";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

interface Idata {
  callbackURL?: string;
  prompt?: string;
  taskId?: string;
}

interface FilesObject {
  [key: string]: File | Blob | string;
}

class APIRequest {
  static API_URL = "https://api.midjourneyapi.io/v2/";

  private api_key: string;
  private callback_uri: string | null;

  constructor(api_key: string, callback_uri: string | null = null) {
    if (api_key === "") {
      throw Error("API_KEY is empty");
    }
    this.api_key = api_key;
    this.callback_uri = callback_uri;
  }

  static send_request(
    endpoint: string,
    data: any,
    headers: any,
    files: any | null = null
  ) {
    const url = APIRequest.API_URL + endpoint;
    let requestOptions: AxiosRequestConfig = {
      headers: headers || {}, // Provide a default value for headers
    };

    if (files) {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      for (const [key, value] of Object.entries(files)) {
        //@ts-ignore
        formData.append(key, value);
      }
      requestOptions.data = formData;
    } else {
      requestOptions.headers!["Content-Type"] = "application/json"; // Use non-null assertion operator
      requestOptions.data = JSON.stringify(data);
    }

    return axios
      .post(url, requestOptions)
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        } else {
          console.log(response);
          return response.data;
        }
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          const { response } = axiosError;
          const status = response?.status;
          const errorMessage = error.message;

          return { error: errorMessage, status: status };
        } else {
          return { error: error.message };
        }
      });
  }

  describe_image(image_file_path: string, filename: string) {
    const endpoint = "describe";
    const files = {
      image: fs.createReadStream(image_file_path),
    };

    const data: Idata = {};
    if (this.callback_uri !== null) {
      data.callbackURL = this.callback_uri;
    }

    const headers = { Authorization: this.api_key };
    return APIRequest.send_request(endpoint, data, headers, files);
  }

  async get_result(task_id: string): Promise<IResultResponse> {
    const endpoint = "result";
    const data = { taskId: task_id };
    const headers = {
      Authorization: this.api_key,
      "Content-Type": "application/json",
    };
    const response = APIRequest.send_request(endpoint, data, headers);
    return response as IResultResponse;
  }

  upscale_image(task_id: string, position: string) {
    const endpoint = "upscale";
    const data = { taskId: task_id, position: position };
    const headers = { Authorization: this.api_key };
    return APIRequest.send_request(endpoint, data, headers);
  }

  async imagine(prompt: string): Promise<ImagineResponse> {
    const endpoint = "imagine";
    const data: Idata = { prompt: prompt };
    if (this.callback_uri !== null) {
      data.callbackURL = this.callback_uri;
    }
    const headers = { Authorization: this.api_key };
    const response = await APIRequest.send_request(endpoint, data, headers);
    return response as ImagineResponse;
  }

  seed(task_id: string) {
    const endpoint = "seed";
    const data: Idata = { taskId: task_id };
    if (this.callback_uri !== null) {
      data.callbackURL = this.callback_uri;
    }
    const headers = { Authorization: this.api_key };
    return APIRequest.send_request(endpoint, data, headers);
  }
}

export { APIRequest };

interface ImagineResponse {
  taskId: string;
}

interface IResultResponse {
  imageURL?: string;
  percentage?: number;
  status?:
    | "completed"
    | "failed"
    | "running"
    | "failed-please-resubmit"
    | "unknown"
    | "pending"
    | undefined;
}
