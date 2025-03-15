import { Hint } from "@/components/custom-ui-components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import React from "react";
import { FaCaretDown } from "react-icons/fa";
import { useToggle } from "react-use";

interface WorkspaceSectionProps {
	label: string;
	children: React.ReactNode;
	hint: string;
	onNew: () => void;
}

function WorkspaceSection({ label, children, hint, onNew }: WorkspaceSectionProps) {
	const [on, toggle] = useToggle(true);

	const hanldeToggle = () => {
		toggle();
	};

	return (
		<div className="flex mt-3 px-2 flex-col">
			<div className="flex items-center px-3.5 group">
				<Button
					variant="transparent"
					className="p-0.5 text-sm text-[#f9edffcc] shrink-0 size-6"
					onClick={hanldeToggle}
				>
					<FaCaretDown
						className={cn(
							"size-4 transition-transform",
							on && "-rotate-90"
						)}
					/>
				</Button>

				<Button
					variant={"transparent"}
					size={"sm"}
					className="group px-1.5 text-sm text-[#f9edffcc] h-[28px] justify-start overflow-hidden flex items-center"
				>
					<span className="truncate">{label}</span>
				</Button>
				{onNew && (
					<Hint label={hint} side="top" align="center">
						<Button
							onClick={onNew}
							variant={"transparent"}
							size={"iconSm"}
							className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-[#f9edffcc] size-6 shrink-0"
						>
							<PlusIcon className="size-5" />
						</Button>
					</Hint>
				)}
			</div>
			{on && <>{children}</>}
		</div>
	);
}

export default WorkspaceSection;
