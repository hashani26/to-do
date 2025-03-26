import request from "supertest";
import { app, server } from "../index";
import { tasks } from "../../src/models/taskModel";

describe("Express Server Tests", () => {
  beforeEach(() => {
    tasks.length = 0;
  });

  afterAll((done) => {
    server.close(done);
  });

  it("should handle JSON request body", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({ name: "Test Task" })
      .set("Content-Type", "application/json");
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should return 404 for an unknown route", async () => {
    const response = await request(app).get("/unknown-route");
    expect(response.status).toBe(404);
  });

  it("should fetch all tasks, sorted by status and priority", async () => {
    tasks.push(
      { id: 1, title: "Task 1", status: "not done", priority: "High" },
      { id: 2, title: "Task 2", status: "done", priority: "Low" },
    );

    const response = await request(app).get("/api/tasks");
    expect(response.status).toBe(200);
    expect(response.body[0].title).toBe("Task 1");
  });

  it("should create a new task", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({ title: "New Task", priority: "Medium" })
      .set("Content-Type", "application/json");

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("New Task");
    expect(response.body.id).toBe(1);
  });

  it("should delete a task", async () => {
    tasks.push({
      id: 1,
      title: "Task 1",
      status: "not done",
      priority: "High",
    });
    const response = await request(app).delete("/api/tasks/1");
    expect(response.status).toBe(204);
    expect(tasks.length).toBe(0);
  });

  it("should return 404 when deleting a non-existing task", async () => {
    const response = await request(app).delete("/api/tasks/99");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Task not found");
  });

  it("should update a task", async () => {
    tasks.push({
      id: 1,
      title: "Task 1",
      status: "not done",
      priority: "Medium",
    });
    const response = await request(app)
      .put("/api/tasks/1")
      .send({ title: "Updated Task", status: "done" })
      .set("Content-Type", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Updated Task");
    expect(response.body.status).toBe("done");
  });

  it("should return 400 if dependency is not completed", async () => {
    tasks.push(
      { id: 1, title: "Task 1", status: "not done", priority: "Medium" },
      {
        id: 2,
        title: "Task 2",
        status: "not done",
        priority: "High",
        dependency: 1,
      },
    );

    const response = await request(app)
      .put("/api/tasks/2")
      .send({ status: "done" })
      .set("Content-Type", "application/json");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Task 1 must be completed first.");
  });
});
