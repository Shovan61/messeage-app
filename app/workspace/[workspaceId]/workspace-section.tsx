import { Hint } from "@/components/custom-ui-components/hint";
import { Button } from "@/components/ui/button";
import React from "react";
import { FaCaretDown } from "react-icons/fa";

interface WorkspaceSectionProps {
	label: string;
	children: React.ReactNode;
	hint: string;
	onNew: () => void;
}

function WorkspaceSection({ label, children, hint, onNew }: WorkspaceSectionProps) {
	return (
		<div className="flex mt-3 px-2 flex-col">
			<div className="flex items-center px-3.5 group">
				<Button
					variant="transparent"
					className="p-0.5 text-sm text-[#f9edffcc] shrink-0 size-6"
				>
					<FaCaretDown className="size-4" />
				</Button>

				<Button
					variant={"transparent"}
					size={"sm"}
					className="group px-1.5 text-sm text-[#f9edffcc] h-[28px] justify-start overflow-hidden flex items-center"
				>
					<span className="truncate">{label}</span>
				</Button>
			</div>
			{children}
		</div>
	);
}

export default WorkspaceSection;
