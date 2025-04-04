import { render, screen, fireEvent } from "@testing-library/react";
import { useTaskStore } from "../../store/taskStore";
// import {UseBoundStore, StoreApi} from "zustand";

import TaskForm from "../../components/TaskForm";
import "@testing-library/jest-dom";

jest.mock("../../store/taskStore", () => ({
  useTaskStore: jest.fn(),
}));

type MockTask = {
  id: number;
  title: string;
};

describe("TaskForm Component", () => {
  const mockAddTask = jest.fn();
  const mockTasks: MockTask[] = [{ id: 1, title: "Existing Task" }];

  beforeEach(() => {
    jest.clearAllMocks();
    (useTaskStore as any).mockReturnValue({
      addTask: mockAddTask,
      tasks: mockTasks,
    });
  });

  test("renders input fields and button", () => {
    render(<TaskForm />);
    expect(screen.getByPlaceholderText("Task title")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add Task/i }),
    ).toBeInTheDocument();
  });

  test("adds a task when form is submitted", () => {
    render(<TaskForm />);
    const titleInput = screen.getByPlaceholderText(
      "Task title",
    ) as HTMLInputElement;
    const addButton = screen.getByRole("button", { name: /Add Task/i });

    fireEvent.change(titleInput, { target: { value: "New Task" } });
    fireEvent.click(addButton);

    expect(mockAddTask).toHaveBeenCalledWith({
      title: "New Task",
      priority: "Low",
      recurrence: undefined,
      dependency: undefined,
      status: "not done",
    });
  });

  test("does not add a task if title is empty", () => {
    render(<TaskForm />);
    const addButton = screen.getByRole("button", { name: /Add Task/i });
    fireEvent.click(addButton);

    expect(mockAddTask).not.toHaveBeenCalled();
  });

  test("updates priority, recurrence, and dependency", () => {
    render(<TaskForm />);

    const prioritySelect = screen.getByDisplayValue("Low") as HTMLSelectElement;
    fireEvent.change(prioritySelect, { target: { value: "High" } });
    expect(prioritySelect.value).toBe("High");

    const recurrenceSelect = screen.getByDisplayValue(
      "No Recurrence",
    ) as HTMLSelectElement;
    fireEvent.change(recurrenceSelect, { target: { value: "weekly" } });
    expect(recurrenceSelect.value).toBe("weekly");

    const dependencySelect = screen.getByDisplayValue(
      "No Dependency",
    ) as HTMLSelectElement;
    fireEvent.change(dependencySelect, { target: { value: "1" } });
    expect(dependencySelect.value).toBe("1");
  });
});
