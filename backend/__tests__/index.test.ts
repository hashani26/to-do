import request from "supertest";
import app from "../src/index";

describe("Task API", () => {
  it("should return an empty task list initially", async () => {
    const res = await request(app).get("/tasks");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

//   it("should add a new task", async () => {
//     const newTask = { title: "Learn Jest" };

//     const res = await request(app).post("/api/tasks").send(newTask);
    
//     expect(res.status).toBe(201);
//     expect(res.body).toHaveProperty("id");
//     expect(res.body.title).toBe("Learn Jest");
//     expect(res.body.completed).toBe(false);
//   });

//   it("should return 400 for invalid task data", async () => {
//     const res = await request(app).post("/api/tasks").send({});
//     expect(res.status).toBe(400);
//     expect(res.body).toHaveProperty("error");
//   });
});
