'use client'

import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'
import '@cyntler/react-doc-viewer/dist/index.css'

/* const DocxViewer: DocRenderer = ({ mainState: { currentDocument } }) => {
	if (!currentDocument) return null

	return (
		<div id="my-pdf-renderer">
			<img
				id="pdf"
				src={currentDocument.fileData as string}
			/>
		</div>
	)
}

DocxViewer.fileTypes = ['pdf', 'application/pdf']
DocxViewer.weight = 1 */

type Doc = {
	uri: string
}[]

const DocViewerComponent = ({
	docName,
	doc,
}: {
	docName: string
	doc: Doc
}) => {
	return (
		<>
			<Dialog>
				<DialogTrigger className="underline">{docName}</DialogTrigger>
				<DialogContent className="max-w-3xl h-4/5 overflow-y-auto bg-primary border-none rounded-2xl">
					<DialogTitle className="hidden"></DialogTitle>
					<DocViewer
						className="h-full w-full"
						documents={doc}
						pluginRenderers={DocViewerRenderers}
					/>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default DocViewerComponent
