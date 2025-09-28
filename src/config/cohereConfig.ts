import { CohereClientV2 } from "cohere-ai";

const cohere = new CohereClientV2({
	token: process.env.APIKEY,
});

export default cohere;