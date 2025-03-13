"use client";

import UserButton from "@/features/auth/components/user-button";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();
	const [open, setOpen] = useCreateWorkspaceModal();
	const { workspaces, isLOading } = useGetWorkspaces();

	const workspaceId = useMemo(() => workspaces?.[0]?._id, [workspaces]);

	useEffect(() => {
		if (isLOading) return;

		if (workspaceId) {
			// redirect to workspace
			router.replace(`/workspace/${workspaceId}`);
		} else {
			// Open creation modal
			setOpen(true);
		}
	}, [workspaceId, isLOading, open, setOpen, router]);

	return (
		<div className="h-full w-full">
			<UserButton />
		</div>
	);
}
