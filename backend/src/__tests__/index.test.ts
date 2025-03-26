import request from "supertest";
import { app, server } from "../index";

describe("Task API", () => {
  afterAll((done) => {
    server.close(done); // Ensure the server stops after tests
  });

  it("should return an empty task list initially", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
