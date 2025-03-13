import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useWorkspaceId } from "@/components/hooks/use-workspaceid";

interface PreferencesModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	initialValue: string;
}

function PreferencesModal({ open, setOpen, initialValue }: PreferencesModalProps) {
	const [value, setvalue] = useState(initialValue);
	const {
		isPending: isWorkspaceUpdating,
		isSetteled,
		isSuccess,
		data,
		mutate: workspaceUpdate,
	} = useUpdateWorkspace();
	const id = useWorkspaceId();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			workspaceUpdate(
				{ workspaceId: id, name: "" },
				{
					onSuccess: (data) => {},
					onError: (err) => {},
					onSetteled: () => {},
				}
			);
		} catch (error) {}
	};

	const handleClose = () => {
		setOpen(false);
		// todo clear form
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="p-0 bg-gray-50 overflow-hidden">
				<DialogHeader className="p-4 border-b bg-white">
					<DialogTitle>{value}</DialogTitle>
				</DialogHeader>
				<div className="px-4 pb-4 flex flex-col gap-y-2">
					<div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
						<div className="flex items-center justify-between">
							<p className="text-xs font-semibold text-muted-foreground">
								Workspace name:
							</p>
							<p className="text-sm text-[#1264a3]">
								Edit
							</p>
						</div>
						<p className="text-sm font-semibold mt-1 text-muted-foreground">
							{value}
						</p>
					</div>

					{/*  */}
					<button
						disabled={false}
						onClick={() => {}}
						className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
					>
						<TrashIcon className="size-4" />
						<p className="text-sm text-rose-700">
							Delete workspace
						</p>
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default PreferencesModal;
