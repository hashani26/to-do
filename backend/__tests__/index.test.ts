import request from "supertest";
import app from "../src/index";

describe("Task API", () => {
  it("should return an empty task list initially", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
