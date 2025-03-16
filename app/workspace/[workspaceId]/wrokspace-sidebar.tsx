import { useWorkspaceId } from "@/components/hooks/use-workspaceid";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspaceByID } from "@/features/workspaces/api/use-get-workspace-by-id";
import { AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizonal } from "lucide-react";
import React from "react";
import WorkspaceHeader from "./workspace-header";
import SidebarItem from "./sidebar-item";
import { useGetChannelByWorkspaceId } from "@/features/channels/api/use-get-channel-by-workspace-id";
import WorkspaceSection from "./workspace-section";
import { useGetMembers } from "@/features/members/api/use-get-members";
import UserItem from "./user-item";

function WorkspaceSidebar() {
	const workspaceId = useWorkspaceId();

	const { channelData, isChannelLOading } = useGetChannelByWorkspaceId({ workspaceId });

	const { data: memberData, isLoading: isMemberLoading } = useCurrentMember({ workspaceId });
	const { data: workspaceData, isLoading: isWorkspaceLoading } = useGetWorkspaceByID({
		workspaceId,
	});

	const { memberArrayDataLoading, membersArrayData } = useGetMembers({ workspaceId });

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
			<WorkspaceHeader
				workspace={workspaceData}
				isAdmin={memberData.role === "admin"}
			/>
			<div className="flex flex-col px-2 mt-3">
				<SidebarItem
					label="Threads"
					icon={MessageSquareText}
					id="threads"
					variant="default"
				/>
				<SidebarItem
					label="Drafts & Sent"
					icon={SendHorizonal}
					id="threads"
					variant="default"
				/>

				<WorkspaceSection
					label="Channels"
					hint="New Channel"
					onNew={() => {}}
				>
					{channelData?.map((curItem) => (
						<div key={curItem?._id}>
							<SidebarItem
								label={curItem?.name}
								icon={HashIcon}
								id={curItem._id}
								variant="default"
							/>
						</div>
					))}
				</WorkspaceSection>

				{/* Member Section */}
				<WorkspaceSection
					label="Direct Messages"
					hint="New direct message"
					onNew={() => {}}
				>
					{membersArrayData?.map((memberItem) => (
						<div key={memberItem?._id}>
							<UserItem
								id={memberItem?._id}
								label={memberItem?.user?.name}
								image={memberItem.user.image}
								// variant={"defalut"}
							/>
						</div>
					))}
				</WorkspaceSection>
			</div>
		</div>
	);
}

export default WorkspaceSidebar;
