import AppRoutes from "./app.route.js";
import { Start } from "./pipeline/index.js";

(async()=>await Start(AppRoutes))();