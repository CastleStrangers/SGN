import { createClient } from "@libsql/client"
import "dotenv/config"

const LOCAL_DB = "file:./prisma/dev.db"
const tursoUrl = (process.env.TURSO_DATABASE_URL || "").trim()
const tursoToken = (process.env.TURSO_AUTH_TOKEN || "").trim()

const local = createClient({ url: LOCAL_DB })
const turso = createClient({ url: tursoUrl, authToken: tursoToken })

const newMember = {
  id: "ab43e716-735c-487c-a1fb-5fbb71f88012",
  nameAr: "محمد سليم عزيزة",
  nameEn: "Mohammad Salim Aziza",
  image: "/images/board/Mohammad_Salim_Aziza.png",
  titleAr: "عضو مكتب الأمانة العامة (المسؤول التقني وعضو مكتب الإعلام)",
  titleEn: "General Secretariat Member (Technical Officer & Media Member)",
  isFounder: 1,
  isLicensing: 0,
  committees: JSON.stringify(["الأمانة العامة", "المكتب الإعلامي"]),
  bioPoints: JSON.stringify([
    "حاصل على دبلوم علوم وبرمجة الحاسب (الكمبيوتر) من جامعة يرفان - أرمينيا 2006، صحفي وناشط حقوقي ومجتمعي ويملك مسيرة مهنية وإعلامية تمتد لأكثر من 27 عاماً.",
    "غادر الوطن الأم سوريا عام 2013 بسبب الضغط من الأجهزة الأمنية التابعة للنظام البائد، وعمل في قسم أمن المعلومات.",
    "مؤسس ومالك شركات عزيزة في سوريا، تركيا، هولندا في مجالات تجارة أجهزة الكمبيوتر والموبايل منذ عام 1999، والتطوير العقاري، والخدمات اللوجستية.",
    "عضو جمعية الصحفيين الهولنديين (NVJ) والمنظمة الدولية للصحافة والإعلام في هولندا (IPMO)، ومحرر الأخبار التقنية في القسم العربي لدى NL NEWS.",
    "عمل وساهم في دعم اللاجئين العرب في مراكز اللجوء من خلال الترجمة وتنظيم دورات رخصة قيادة، وعمل مع عدة منظمات إنسانية في هولندا وآخرها منظمة لكل الناس حيث شغل منصب رئيس القسم التقني."
  ]),
  website: "https://www.sy-nl.org/",
  kvkNumber: "96718943",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

async function main() {
  console.log("إضافة محمد سليم عزيزة إلى board_members\n")

  // --- SQLite ---
  const localCols = (await local.execute("PRAGMA table_info(board_members)")).rows.map((r) => r.name as string)
  const localPlaceholders = localCols.map(() => "?").join(", ")
  const localColList = localCols.map((c) => `"${c}"`).join(", ")
  const localValues = localCols.map((c) => (newMember as any)[c] ?? null)

  await local.execute({
    sql: `INSERT INTO board_members (${localColList}) VALUES (${localPlaceholders})`,
    args: localValues,
  })
  console.log("  ✅ SQLite: تمت الإضافة")

  // --- Turso ---
  const tursoCols = (await turso.execute("PRAGMA table_info(board_members)")).rows.map((r) => r.name as string)
  const tursoPlaceholders = tursoCols.map(() => "?").join(", ")
  const tursoColList = tursoCols.map((c) => `"${c}"`).join(", ")
  const tursoValues = tursoCols.map((c) => (newMember as any)[c] ?? null)

  await turso.execute({
    sql: `INSERT INTO board_members (${tursoColList}) VALUES (${tursoPlaceholders})`,
    args: tursoValues,
  })
  console.log("  ✅ Turso: تمت الإضافة")

  local.close()
  turso.close()
  console.log("\n✅ تم بنجاح")
}

main().catch(console.error)
