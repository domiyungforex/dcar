import { setData, getData, deleteData, listKeys } from "./upstash-storage"

/**
 * High-level submission storage using Upstash Redis
 * Stores form submissions (inquiries, newsletter, uploads)
 */

export interface Submission {
  id: string
  type: "inquiry" | "newsletter" | "file-upload" | "service-inquiry" | "inspection-booking"
  email: string
  data: Record<string, unknown>
  createdAt: string
  status: "new" | "read" | "resolved"
}

const SUBMISSIONS_PREFIX = "submission:"
const SUBMISSIONS_INDEX = "submissions:all"

/**
 * Save a form submission
 */
export async function saveSubmission(
  type: "inquiry" | "newsletter" | "file-upload" | "service-inquiry" | "inspection-booking",
  email: string,
  data: Record<string, unknown>,
): Promise<Submission> {
  const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const submission: Submission = {
    id,
    type,
    email,
    data,
    createdAt: new Date().toISOString(),
    status: "new",
  }

  const key = `${SUBMISSIONS_PREFIX}${id}`
  await setData(key, submission as unknown as Record<string, unknown>)

  // Add to index for quick listing
  await setData(`${SUBMISSIONS_INDEX}:${id}`, { id, type, createdAt: submission.createdAt })

  return submission
}

/**
 * Fetch all submissions of a specific type
 */
export async function getSubmissions(type?: "inquiry" | "newsletter" | "file-upload"): Promise<Submission[]> {
  try {
    const keys = await listKeys(`${SUBMISSIONS_PREFIX}*`)
    const submissions: Submission[] = []

    for (const key of keys) {
      const data = await getData(key)
      if (data) {
        const submission = data as unknown as Submission
        if (!type || submission.type === type) {
          submissions.push(submission)
        }
      }
    }

    return submissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error("[v0] Get submissions error:", error)
    return []
  }
}

/**
 * Get a single submission by ID
 */
export async function getSubmission(id: string): Promise<Submission | null> {
  try {
    const key = `${SUBMISSIONS_PREFIX}${id}`
    return await getData(key as unknown as string).then((d) => (d as unknown as Submission) || null)
  } catch (error) {
    console.error("[v0] Get submission error:", error)
    return null
  }
}

/**
 * Update submission status
 */
export async function updateSubmissionStatus(id: string, status: "new" | "read" | "resolved"): Promise<void> {
  try {
    const key = `${SUBMISSIONS_PREFIX}${id}`
    const data = await getData(key)

    if (!data) throw new Error("Submission not found")

    const submission = data as unknown as Submission
    submission.status = status

    await setData(key, submission as unknown as Record<string, unknown>)
  } catch (error) {
    console.error("[v0] Update status error:", error)
    throw new Error("Failed to update submission")
  }
}

/**
 * Delete a submission
 */
export async function deleteSubmission(id: string): Promise<void> {
  try {
    const key = `${SUBMISSIONS_PREFIX}${id}`
    await deleteData(key)
    await deleteData(`${SUBMISSIONS_INDEX}:${id}`)
  } catch (error) {
    console.error("[v0] Delete submission error:", error)
    throw new Error("Failed to delete submission")
  }
}
