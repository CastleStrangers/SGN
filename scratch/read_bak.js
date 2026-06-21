const { createClient } = require("@libsql/client");
const path = require("path");

async function main() {
  const dbPath = path.join(__dirname, "..", "prisma", "dev.db.bak");
  console.log("Reading DB from:", dbPath);
  const client = createClient({ url: `file:${dbPath}` });

  try {
    const result = await client.execute("SELECT id, nameAr, nameEn, image FROM BoardMember");
    console.log("=== Board Members in dev.db.bak ===");
    console.log(JSON.stringify(result.rows, null, 2));
  } catch (err) {
    console.error("Error reading database:", err.message);
  } finally {
    client.close();
  }
}

main().catch(console.error);
