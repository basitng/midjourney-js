import Midjourney from "..";
const midjourney = new Midjourney("", "");

const seed = midjourney
  .imagine(
    "A wolf wearing a tophat on the beach with waves crashing in the background --ar 3:2"
  )
  .then(async (response) => {
    const result = await midjourney.result(response);
    if (result?.status === "completed") {
      console.log(result.imageUrl);
    }
  });
console.log("🚀 ~ file: index.ts:14 ~ seed:", seed);
