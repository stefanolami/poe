import React from 'react'
import DocViewer, { DocRenderer } from '@cyntler/react-doc-viewer'

const DocxViewer: DocRenderer = ({ mainState: { currentDocument } }) => {
	if (!currentDocument) return null

	return (
		<div id="my-png-renderer">
			<img
				id="png-img"
				src={currentDocument.fileData as string}
			/>
		</div>
	)
}

DocxViewer.fileTypes = ['png', 'image/png']
DocxViewer.weight = 1

export default DocxViewer
