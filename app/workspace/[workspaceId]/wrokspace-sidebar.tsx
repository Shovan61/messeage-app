import { useWorkspaceId } from "@/components/hooks/use-workspaceid";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspaceByID } from "@/features/workspaces/api/use-get-workspace-by-id";
import { AlertTriangle, Loader } from "lucide-react";
import React from "react";
import WorkspaceHeader from "./workspace-header";

function WorkspaceSidebar() {
	const workspaceId = useWorkspaceId();

	const { data: memberData, isLoading: isMemberLoading } = useCurrentMember({ workspaceId });
	const { data: workspaceData, isLoading: isWorkspaceLoading } = useGetWorkspaceByID({
		workspaceId,
	});

	if (isMemberLoading || isWorkspaceLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-full bg-[#5e2c5f]">
				<Loader className="animate-spin size-4 text-white" />
			</div>
		);
	}
	if (!memberData || !workspaceData) {
		return (
			<div className="flex flex-col gap-y-2 items-center justify-center h-full bg-[#5e2c5f]">
				<AlertTriangle className=" size-4 text-white" />
				<p className="text-white text-xs">Workspace not found</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full bg-[#5e2c5f]">
			{/* Workspace header */}
			<WorkspaceHeader workspace={workspaceData} isAdmin={memberData.role === "admin"}/>
		</div>
	);
}

export default WorkspaceSidebar;
