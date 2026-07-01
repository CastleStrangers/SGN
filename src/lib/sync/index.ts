import type { SyncSource, ExtractedArticle, SyncResult, SyncConfig } from "./types"
import { DEFAULT_SOURCES } from "./types"
import { extractArticles } from "./extractor"
import { categorizeByMapping, categorizeWithAI } from "./categorizer"
import { processArticleMedia } from "./media"
import { syncArticleToDb } from "./db-sync"

export type { SyncSource, ExtractedArticle, SyncResult, SyncConfig }
export { DEFAULT_SOURCES }
export { extractArticles } from "./extractor"
export { categorizeByMapping, categorizeWithAI } from "./categorizer"
export { downloadMedia, processArticleMedia, extractIframeUrl } from "./media"
export { syncArticleToDb } from "./db-sync"

export async function runSync(
  sources?: SyncSource[],
  config?: Partial<SyncConfig>
): Promise<SyncResult[]> {
  const targets = sources || DEFAULT_SOURCES
  const results: SyncResult[] = []
  const autoCategorize = config?.autoCategorize ?? true
  const downloadMedia = config?.downloadMedia ?? true

  for (const source of targets) {
    if (!source.enabled) {
      results.push({
        success: true,
        source: source.name,
        fetched: 0,
        new: 0,
        updated: 0,
        skipped: 0,
        errors: [],
        duration: 0,
      })
      continue
    }

    const start = Date.now()
    const result: SyncResult = {
      success: true,
      source: source.name,
      fetched: 0,
      new: 0,
      updated: 0,
      skipped: 0,
      errors: [],
      duration: 0,
    }

    try {
      const articles = await extractArticles(source)
      result.fetched = articles.length

      // Sort articles from oldest to newest (ascending) to sync in correct chronological order
      const sortedArticles = [...articles].sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime())

      for (const article of sortedArticles) {
        const isCommunityNews = !source.translate
        const targetLocales = isCommunityNews ? ["ar"] : ["ar", "nl", "en"]

        for (const targetLocale of targetLocales) {
          try {
            let finalArticle = { ...article }
            if (source.translate) {
              const { translateArticleToLocale } = await import("./translator")
              finalArticle = await translateArticleToLocale(article, targetLocale)
            }

            let category: string
            if (autoCategorize) {
              category = await categorizeWithAI(finalArticle)
            } else {
              category = source.category || finalArticle.category
            }

            if (downloadMedia) {
              const mediaResult = await processArticleMedia(
                finalArticle.content,
                source.url
              )
              finalArticle.content = mediaResult.content
              finalArticle.image = finalArticle.image
                ? (await downloadSingleMedia(finalArticle.image, source.url)) || finalArticle.image
                : mediaResult.thumbnail || finalArticle.image
            }

            const syncResult = await syncArticleToDb(finalArticle, category, targetLocale)
            if (syncResult.status === "new") result.new++
            else if (syncResult.status === "updated") result.updated++
            else result.skipped++
          } catch (err) {
            result.errors.push(
              `Locale ${targetLocale} - Article "${article.title.slice(0, 50)}": ${err instanceof Error ? err.message : String(err)}`
            )
          }
        }
      }
    } catch (err) {
      result.success = false
      result.errors.push(
        `Source "${source.name}": ${err instanceof Error ? err.message : String(err)}`
      )
    }

    result.duration = Date.now() - start
    results.push(result)
  }

  return results
}

async function downloadSingleMedia(
  url: string,
  baseUrl: string
): Promise<string | null> {
  const { downloadMedia } = await import("./media")
  return downloadMedia(url, baseUrl)
}
