import { config } from "dotenv";

config({
  path: `./.env.${process.env.NODE_ENV || "development"}.local`,
});

export const { NODE_ENV, PORT, PERSISTENCE, MONGO_URL, ADMIN_EMAIL, ADMIN_PASSWORD, SECRET_JWT, GITHUB_CLIENT_ID,
GITHUB_CLIENT_SECRET, EMAIL, EMAIL_PASSWORD, BASE_API_URL, CARTS_ROUTE, PRODUCTS_ROUTE, SESSIONS_ROUTE } = process.env;