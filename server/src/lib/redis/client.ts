import { Client } from "redis-om";
import config from "../../config";

const client = await new Client().open(config.redis.url);

export default client;
