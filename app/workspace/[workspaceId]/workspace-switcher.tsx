import React from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/components/hooks/use-workspaceid";
import { useGetWorkspaceByID } from "@/features/workspaces/api/use-get-workspace-by-id";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

function WorkspaceSwitcher() {
	const router = useRouter();
	const workspaceId = useWorkspaceId();
	const [_open, setopen] = useCreateWorkspaceModal();

	const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceByID({
		workspaceId,
	});
	const { workspaces, isLOading: workspacesLOading } = useGetWorkspaces();

	const filteredWorkspaces = workspaces?.filter(
		(curWOrkspace) => curWOrkspace?._id !== workspace?._id
	);

	return (
		<>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button className="size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl">
						{workspaceLoading ? (
							<Loader className="size-5 animate-spin shrink-0" />
						) : (
							workspace?.name.charAt(0).toUpperCase()
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" side="bottom" className="w-60">
					{/* SHow current workspace */}
					<DropdownMenuItem
						className="cursor-pointer flex-col justify-start items-start capitalize"
						onClick={() =>
							router.push(`/workspace/${workspaceId}`)
						}
					>
						{workspace?.name}
						<span className="text-xs text-muted-foreground">
							Active workspace
						</span>
					</DropdownMenuItem>
					{/* LIst of all other workspaces */}
					{filteredWorkspaces?.map((workspace) => (
						<DropdownMenuItem
							className="cursor-pointer overflow-hidden capitalize"
							onClick={() =>
								router.push(
									`/workspace/${workspace?._id}`
								)
							}
						>
							<div className="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg rounded-md flex items-center justify-center mr-2 shrink-0">
								{workspace?.name
									.charAt(0)
									.toUpperCase()}
							</div>
							<div className="text-xs text-muted-foreground truncate">
								{workspace?.name}
							</div>
						</DropdownMenuItem>
					))}
					{/*  */}
					<DropdownMenuItem
						className="cursor-pointer"
						onClick={() => setopen(true)}
					>
						<div className="size-9 relative overflow-hidden bg-[#F2F2F2] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
							<Plus />
						</div>
						Create a new workspace
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}

export default WorkspaceSwitcher;
