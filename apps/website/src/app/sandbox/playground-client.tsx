"use client"

import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarInset, SidebarProvider } from "@/styles/default/ui/sidebar"
import { useAuth } from "./auth/auth-context"
import { PlaygroundCodeViewer } from "./components/playground-code-viewer"
import { PlaygroundHeader } from "./components/playground-header"
import { PlaygroundPreview } from "./components/playground-preview"
import { PlaygroundSidebar } from "./components/playground-sidebar"
import {
	type DeviceSize,
	type FilesData,
	type PreviewKey,
	type ViewMode,
	sandboxComponents,
} from "./components/types"
import { useComments } from "./components/use-comments"
import { useInspectMode } from "./components/use-inspect-mode"

export interface PlaygroundClientProps {
	files: FilesData
}

export function PlaygroundClient({ files }: PlaygroundClientProps) {
	const { user, isLoading } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (!isLoading && !user) {
			router.replace("/sandbox/auth/sign-in?callbackUrl=/sandbox")
		}
	}, [user, isLoading, router])

	const [activeComponent, setActiveComponent] = useState<PreviewKey>("hero-21")
	const [activeFile, setActiveFile] = useState<string>("hero-section.tsx")
	const [viewMode, setViewMode] = useState<ViewMode>("preview")
	const [deviceSize, setDeviceSize] = useState<DeviceSize>("desktop")
	const [isCommentsEnabled, setIsCommentsEnabled] = useState(false)

	const iframeRef = useRef<HTMLIFrameElement>(null)

	const activeComponentConfig =
		sandboxComponents.find((c) => c.id === activeComponent) ||
		sandboxComponents[0]

	// DOM Inspect effect
	useInspectMode(iframeRef, viewMode, activeComponent)

	// Figma-style comments hook
	const {
		comments,
		draftComment,
		setDraftComment,
		isSubmitting,
		addComment,
		deleteComment,
	} = useComments(iframeRef, activeComponent, viewMode, isCommentsEnabled)

	const handleSelectComponent = (
		component: PreviewKey,
		defaultFile: string
	) => {
		setActiveComponent(component)
		setActiveFile(defaultFile)
	}

	return (
		<SidebarProvider className="h-svh" defaultWidth="13.5rem">
			<PlaygroundSidebar
				activeComponent={activeComponent}
				onSelectComponent={handleSelectComponent}
			/>

			<SidebarInset className="bg-bg relative flex min-h-0 flex-1 flex-col overflow-hidden">
				<PlaygroundHeader
					activeComponentConfig={activeComponentConfig}
					activeFile={activeFile}
					viewMode={viewMode}
					onViewModeChange={(mode) => {
						setViewMode(mode)
						if (mode !== "inspect") {
							setIsCommentsEnabled(false)
							setDraftComment(null)
						} else {
							setIsCommentsEnabled(true)
						}
					}}
					deviceSize={deviceSize}
					onDeviceSizeChange={setDeviceSize}
					isCommentsEnabled={isCommentsEnabled}
					onToggleComments={(enabled) => {
						setIsCommentsEnabled(enabled)
						if (!enabled) {
							setDraftComment(null)
						}
					}}
					commentsCount={comments.length}
				/>

				<div className="flex min-h-0 flex-1 overflow-hidden">
					<div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
						{(viewMode === "preview" || viewMode === "inspect") && (
							<PlaygroundPreview
								activeComponentConfig={activeComponentConfig}
								deviceSize={deviceSize}
								iframeRef={iframeRef}
								comments={comments}
								draftComment={draftComment}
								onCancelDraft={() => setDraftComment(null)}
								onSubmitDraft={addComment}
								onDeleteComment={deleteComment}
								isSubmitting={isSubmitting}
								isCommentsVisible={viewMode === "inspect" && isCommentsEnabled}
							/>
						)}

						{viewMode === "code" && (
							<PlaygroundCodeViewer
								files={files}
								activeComponentConfig={activeComponentConfig}
								activeFile={activeFile}
								onSelectFile={setActiveFile}
							/>
						)}
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
