import { uploadJSON, fetchJSON, deleteFile, listFiles } from "./blob-storage"

/**
 * High-level data storage for submissions
 * Stores form submissions (inquiries, newsletter, uploads) as JSON files
 */

export interface Submission {
  id: string
  type: "inquiry" | "newsletter" | "file-upload"
  email: string
  data: Record<string, unknown>
  createdAt: string
  status: "new" | "read" | "resolved"
}

const SUBMISSIONS_PREFIX = "submissions/"

/**
 * Save a form submission
 */
export async function saveSubmission(
  type: "inquiry" | "newsletter" | "file-upload",
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

  await uploadJSON(submission as unknown as Record<string, unknown>, `${SUBMISSIONS_PREFIX}${id}.json`)
  return submission
}

/**
 * Fetch all submissions of a specific type
 */
export async function getSubmissions(type?: "inquiry" | "newsletter" | "file-upload"): Promise<Submission[]> {
  try {
    const files = await listFiles(SUBMISSIONS_PREFIX)
    const submissions: Submission[] = []

    for (const file of files) {
      const data = await fetchJSON(file.url)
      const submission = data as unknown as Submission
      if (!type || submission.type === type) {
        submissions.push(submission)
      }
    }

    return submissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error("[v0] Get submissions error:", error)
    return []
  }
}

/**
 * Update submission status
 */
export async function updateSubmissionStatus(id: string, status: "new" | "read" | "resolved"): Promise<void> {
  try {
    const files = await listFiles(SUBMISSIONS_PREFIX)
    const file = files.find((f) => f.pathname.includes(id))

    if (!file) throw new Error("Submission not found")

    const data = await fetchJSON(file.url)
    const submission = data as unknown as Submission
    submission.status = status

    await uploadJSON(submission as unknown as Record<string, unknown>, `${SUBMISSIONS_PREFIX}${id}.json`)
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
    await deleteFile(`${SUBMISSIONS_PREFIX}${id}.json`)
  } catch (error) {
    console.error("[v0] Delete submission error:", error)
    throw new Error("Failed to delete submission")
  }
}
