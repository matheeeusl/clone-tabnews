import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";
import { error } from "node:console";

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response
      .status(405)
      .json({
        error: `Method "${request.method}" Not Allowed`,
      })
      .end();
  }
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigrationsOptions = {
      dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationsOptions);
      response.status(200).json(pendingMigrations);
    }
    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationsOptions,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        response.status(201).json(migratedMigrations);
      }
      response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
