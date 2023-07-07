const { APIRequest } = require("midjourney/irequest");

class Midjourney {
  constructor(api_key, callback_uri) {
    this.api_request = new APIRequest(api_key, callback_uri);
  }

  async result(seed) {
    const task_id = seed.taskId;

    if (!task_id) {
      return { status: "error", message: "Invalid seed data" };
    }

    console.log("Running task....");
    while (true) {
      try {
        const response = await this.api_request.get_result(task_id);
        if (response && typeof response === "object") {
          if ("imageURL" in response) {
            console.log("Completed task....");
            return { status: "completed", imageUrl: response.imageURL };
          } else if ("seed" in response) {
            console.log("Completed task....");
            return { status: "completed", seed: response.seed };
          } else if ("content" in response) {
            console.log("Completed task....");
            return { status: "completed", content: response.content };
          } else if (response.status === "running") {
            const percentage = response.percentage;
            console.log(`Task is ${percentage}% complete.`);
          } else if (
            [
              "pending",
              "waiting-to-start",
              "unknown",
              {},
              "failed-please-resubmit",
            ].includes(response.status)
          ) {
            console.log("Task is pending. Waiting for it to start...");
            await sleep(2000);
            continue;
          }
        } else {
          console.log("Waiting for task to start...");
          await sleep(2000);
          continue;
        }

        if (!["running", "pending", "unknown"].includes(response.status)) {
          break;
        }
      } catch (e) {
        return { status: "error", message: e.toString() };
      }
    }
  }

  imagine(prompt) {
    return this.api_request.imagine(prompt);
  }

  upscale(task_id, position) {
    return this.api_request.upscale_image(task_id, position);
  }

  seed(task_id) {
    return this.api_request.seed(task_id);
  }

  describe(image_path, filename) {
    return this.api_request.describe_image(image_path, filename);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = Midjourney;
