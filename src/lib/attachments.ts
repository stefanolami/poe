/** Attachment utilities for downloading stored document files. */
import { createClient } from '@/supabase/server'

export interface AttachmentDescriptor {
	filename?: string
	content: Buffer
}

/**
 * Downloads an array of file paths from the `documents` bucket.
 * The paths are normalized by replacing the leading entity folder pattern if needed.
 */
export async function fetchAttachments(
	filePaths: string[] | null | undefined,
	replaceFrom: string,
	replaceTo: string
): Promise<AttachmentDescriptor[]> {
	if (!filePaths || filePaths.length === 0) return []
	const supabase = await createClient()
	const downloads = await Promise.all(
		filePaths.map(async (filePath: string) => {
			const normalized = filePath.replace(replaceFrom, replaceTo)
			const { data, error } = await supabase.storage
				.from('documents')
				.download(normalized)
			if (error || !data) return null
			const buf = Buffer.from(await data.arrayBuffer())
			return { filename: filePath.split('/').pop(), content: buf }
		})
	)
	const cleaned: AttachmentDescriptor[] = []
	for (const d of downloads) if (d) cleaned.push(d)
	return cleaned
}
