import express from "express";
import passport from "passport";
import displayRoutes from "express-routemap";
import cookieParser from "cookie-parser";
import handlebars from "express-handlebars";
import cors from "cors";
import { setLogger } from "./utils/logger.js";
import { NODE_ENV, PORT } from "./config/config.js";
import __dirname from "./utils.js";
import initializePassport from "./config/passport.config.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "./config/swagger.config.js";

import viewsRoutes from "./routes/view.routes.js";
import userRoutes from "./routes/user.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import productRoutes from "./routes/product.routes.js";
import sessionRoutes from "./routes/session.routes.js";

const app = express();
const PORT_APP = Number(PORT) || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(setLogger);

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

initializePassport();
app.use(passport.initialize());

const specs = swaggerJSDoc(swaggerOptions);

app.use("/", viewsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/docs/", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT_APP, () => {
  displayRoutes(app);
  console.log(`Running on PORT: ${PORT_APP}, environment: ${NODE_ENV}`);
});