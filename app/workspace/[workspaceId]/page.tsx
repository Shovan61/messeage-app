"use client";

import { useWorkspaceId } from "@/components/hooks/use-workspaceid";
import { useGetChannelByWorkspaceId } from "@/features/channels/api/use-get-channel-by-workspace-id";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspaceByID } from "@/features/workspaces/api/use-get-workspace-by-id";
import { Loader, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

function WorkspacePage() {
	const id = useWorkspaceId();
	const router = useRouter();
	const [open, setOpen] = useCreateChannelModal();

	const { data: workspaceData, isLoading: workspaceLoading } = useGetWorkspaceByID({
		workspaceId: id,
	});

	const { data: currentMember , isLoading: memberLoading} = useCurrentMember({ workspaceId: id });

	const { channelData, isChannelLOading } = useGetChannelByWorkspaceId({ workspaceId: id });

	const channelId = useMemo(() => channelData?.[0]?._id, [channelData]);
	const isAdmin = useMemo(() => currentMember?.role === "admin", [currentMember]);

	useEffect(() => {
		if (workspaceLoading || isChannelLOading || !workspaceData || memberLoading) return;

		if (channelId) {
			router.push(`/workspace/${id}/channel/${channelId}`);
		} else if (!open && isAdmin) {
			setOpen(true);
		}
	}, [
		workspaceData,
		setOpen,
		router,
		id,
		open,
		isAdmin,
		isChannelLOading,
		workspaceLoading,
		channelId,
		memberLoading
	]);

	if (workspaceLoading || isChannelLOading || memberLoading) {
		return (
			<div className="flex flex-1 h-full items-center justify-center flex-col gap-2">
				<Loader className="size-6 text-muted-foreground animate-spin" />
			</div>
		);
	}
	if (!workspaceData || !currentMember) {
		return (
			<div className="flex flex-1 h-full items-center justify-center flex-col gap-2">
				<TriangleAlert className="size-6 text-muted-foreground " />
				<span className="text-sm text-muted-foreground">
					Workspace not found!
				</span>
			</div>
		);
	}

	return (
		<div className="flex flex-1 h-full items-center justify-center flex-col gap-2">
			<TriangleAlert className="size-6 text-muted-foreground " />
			<span className="text-sm text-muted-foreground">
				No channel found!
			</span>
		</div>
	);

}

export default WorkspacePage;
