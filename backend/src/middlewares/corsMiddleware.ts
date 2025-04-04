import cors from "cors";

export const corsMiddleware = cors({
  origin: true, // Remove for production
  optionsSuccessStatus: 200,
  methods: ["GET", "PUT", "POST", "DELETE"],
});
