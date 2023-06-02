import swaggerUi from "swagger-ui-express";

import { app } from ".";
import { usersRoutes } from "./routes/users.routes";
import swaggerFile from "./swagger.json";

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(usersRoutes);

app.listen(3333, () => console.log("Server is running!"));
