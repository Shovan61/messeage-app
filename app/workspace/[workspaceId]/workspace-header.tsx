import React, { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Doc } from "@/convex/_generated/dataModel";
import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import { Hint } from "@/components/custom-ui-components/hint";
import PreferencesModal from "./preferences-modal";
import InviteModal from "./invite-modal";

interface WorkspaceHeaderProps {
	workspace: Doc<"workspaces">;
	isAdmin: boolean;
}

function WorkspaceHeader({ workspace, isAdmin }: WorkspaceHeaderProps) {
	const [preferencesOpen, setPreferencesOpen] = useState(false);
	const [inviteOpen, setinviteOpen] = useState(false);

	return (
		<>
			<InviteModal
				open={inviteOpen}
				setOpen={setinviteOpen}
				name={workspace.name}
				joinCode={workspace.joinCode}
			/>
			<PreferencesModal
				open={preferencesOpen}
				setOpen={setPreferencesOpen}
				initialValue={workspace.name}
			/>
			<div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant={"transparent"}
							size="sm"
							className="font-semibold text-lg w-auto p-1.5 overflow-hidden "
						>
							<span className="truncate  flex items-center">
								{workspace.name}{" "}
								<ChevronDown className="size-4 ml-1 shrink-0 mt-1" />
							</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						side="bottom"
						className="w-64"
					>
						<DropdownMenuItem className="">
							<div className="size-9 overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2">
								{workspace.name
									.charAt(0)
									.toUpperCase()}
							</div>

							<div className="flex flex-col items-start">
								<p className="font-bold">
									{workspace.name}
								</p>
								<p className="text-xs text-muted-foreground">
									Active Workspace
								</p>
							</div>
						</DropdownMenuItem>
						{isAdmin && (
							<>
								<DropdownMenuSeparator></DropdownMenuSeparator>
								<DropdownMenuItem
									className="cursor-pointer py-2"
									onClick={() =>
										setinviteOpen(true)
									}
								>
									<span className="font-semibold text-xs">
										Invite peope to{" "}
										{workspace.name}
									</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									className="cursor-pointer py-2"
									onClick={() =>
										setPreferencesOpen(
											true
										)
									}
								>
									<span className="font-semibold text-xs">
										Preferance
									</span>
								</DropdownMenuItem>
							</>
						)}
					</DropdownMenuContent>
				</DropdownMenu>

				{/*  */}
				<div className="flex items-center gap-0.5">
					<Hint label="Filter coversations" side="bottom">
						<Button variant={"transparent"} size={"iconSm"}>
							<ListFilter className="size-4" />
						</Button>
					</Hint>

					<Hint label="New Message" side="bottom">
						<Button variant={"transparent"} size={"iconSm"}>
							<SquarePen className="size-4" />
						</Button>
					</Hint>
				</div>
			</div>
		</>
	);
}

export default WorkspaceHeader;
