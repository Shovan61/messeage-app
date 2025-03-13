"use client";

import React from "react";
import Toolbar from "./toolbar";
import SideBar from "./sidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import WorkspaceSidebar from "./wrokspace-sidebar";

interface WorkspaceIdLayout {
	children: React.ReactNode;
}

function WorkspaceLayout({ children }: WorkspaceIdLayout) {
	return (
		<div className="h-full w-full">
			<Toolbar />
			<div className="h-[calc(100vh-40px)] flex">
				<SideBar />
				<ResizablePanelGroup direction="horizontal" autoSaveId="slack">
					<ResizablePanel
						defaultSize={20}
						minSize={10}
						className="bg-[#5E2C5F]"
					>
						<WorkspaceSidebar />
					</ResizablePanel>

					<ResizableHandle withHandle />

					<ResizablePanel minSize={20}>{children}</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	);
}

export default WorkspaceLayout;
