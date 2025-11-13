import { app } from './app';
import { env } from "../../config/envConfig";

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
    app.log.info(`HTTP Server running at: http://localhost:${env.PORT}`);
});