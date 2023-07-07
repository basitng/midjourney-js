const axios = require("axios");
const fs = require("fs");

class APIRequest {
  static API_URL = "https://api.midjourneyapi.io/v2/";

  constructor(api_key, callback_uri = null) {
    this.api_key = api_key;
    this.callback_uri = callback_uri;
  }

  static send_request(endpoint, data, headers, files = null) {
    const url = APIRequest.API_URL + endpoint;
    let requestOptions = {
      headers: headers,
    };

    if (files) {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      for (const [key, value] of Object.entries(files)) {
        formData.append(key, value);
      }
      requestOptions.data = formData;
    } else {
      requestOptions.headers["Content-Type"] = "application/json";
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
        console.error(error);
        return { error: error.message };
      });
  }

  describe_image(image_file_path, filename) {
    const endpoint = "describe";
    const files = {
      image: fs.createReadStream(image_file_path),
    };

    const data = {};
    if (this.callback_uri !== null) {
      data.callbackURL = this.callback_uri;
    }

    const headers = { Authorization: this.api_key };
    return APIRequest.send_request(endpoint, data, headers, files);
  }

  get_result(task_id) {
    const endpoint = "result";
    const data = { taskId: task_id };
    const headers = {
      Authorization: this.api_key,
      "Content-Type": "application/json",
    };
    return APIRequest.send_request(endpoint, data, headers);
  }

  upscale_image(task_id, position) {
    const endpoint = "upscale";
    const data = { taskId: task_id, position: position };
    const headers = { Authorization: this.api_key };
    return APIRequest.send_request(endpoint, data, headers);
  }

  imagine(prompt) {
    const endpoint = "imagine";
    const data = { prompt: prompt };
    if (this.callback_uri !== null) {
      data.callbackURL = this.callback_uri;
    }
    const headers = { Authorization: this.api_key };
    return APIRequest.send_request(endpoint, data, headers);
  }

  seed(task_id) {
    const endpoint = "seed";
    const data = { taskId: task_id };
    if (this.callback_uri !== null) {
      data.callbackURL = this.callback_uri;
    }
    const headers = { Authorization: this.api_key };
    return APIRequest.send_request(endpoint, data, headers);
  }
}

module.exports = APIRequest;
