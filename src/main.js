import { logger } from "./application/logging.js";
import { app } from "./application/web.js";

app.listen(3000, () => {
    logger.info('App start in port 3000')
})