import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test('GET to /api/v1/status returns 200', async () => {
  const response = await fetch('http://localhost:3000/api/v1/status');
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  const updatedAt = responseBody.updated_at;
  expect(new Date(updatedAt).toISOString()).toEqual(updatedAt);

  const database = responseBody.dependencies.database;
  expect(database).toBeDefined();

  expect(database.version).toEqual('16.0')
  expect(database.max_connections).toEqual(100)
  expect(database.opened_connections).toEqual(1)

});