"use client";

import { useWorkspaceId } from "@/components/hooks/use-workspaceid";
import { Button } from "@/components/ui/button";
import { useGetWorkspaceByID } from "@/features/workspaces/api/use-get-workspace-by-id";
import { Search, Info } from "lucide-react";
import React from "react";

function Toolbar() {
	const workspaceId = useWorkspaceId();
	const { data } = useGetWorkspaceByID({ workspaceId });

	return (
		<nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
			<div className="flex-1" />
			<div className="min-w-[280px] max-w-[642px] grow shrink">
				<Button
					size={"sm"}
					className="bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2"
				>
					<Search className="size-4 text-white mr-2" />
					<span className="text-white text-xs">
						Search {data?.name} workspace
					</span>
				</Button>
			</div>

			<div className="ml-auto flex flex-1 items-center justify-end">
				<Button variant={"transparent"} size={"iconSm"}>
					<Info className="size-5 text-white" />
				</Button>
			</div>
		</nav>
	);
}

export default Toolbar;
