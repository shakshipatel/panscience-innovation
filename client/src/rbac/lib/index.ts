import AUTH_ROUTES from "./auth";
import PUBLIC_ROUTES from "./public";
import USER_ROUTES from "./user";

export const ROLE_ROUTES = {
  public: PUBLIC_ROUTES,
  user: USER_ROUTES,
  auth: AUTH_ROUTES,
};
