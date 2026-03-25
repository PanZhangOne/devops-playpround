import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

const dbMock = vi.hoisted(() => ({
  addTask: vi.fn(),
  checkTable: vi.fn(),
  deleteTask: vi.fn(),
  getCout: vi.fn(),
  getTask: vi.fn(),
  setComplete: vi.fn(),
}));

vi.mock("./db.js", () => dbMock);

import app from "./index.js";

describe("GET /api/health", () => {
  beforeEach(() => {
    dbMock.getCout.mockReset();
  });

  it("should return ok when database is reachable", async () => {
    dbMock.getCout.mockResolvedValue(1);

    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
  });

  it("should return 503 when database is unavailable", async () => {
    dbMock.getCout.mockRejectedValue(new Error("db down"));

    const res = await request(app).get("/api/health");

    expect(res.status).toBe(503);
  });
});
