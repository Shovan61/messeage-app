import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Loader, TrashIcon } from "lucide-react";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useWorkspaceId } from "@/components/hooks/use-workspaceid";
import { useDeleteWokspace } from "@/features/workspaces/api/use-delete-workspace";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirmModal } from "@/components/hooks/use-confirm";

interface PreferencesModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	initialValue: string;
}

function PreferencesModal({ open, setOpen, initialValue }: PreferencesModalProps) {
	const router = useRouter();

	const { ConfirmationDialog, confirm } = useConfirmModal();

	const [value, setvalue] = useState(initialValue);
	const [isEdit, setisEdit] = useState<boolean>(false);
	const [editValue, seteditValue] = useState<string>(initialValue);

	const { isPending: isWorkspaceUpdating, mutate: workspaceUpdate } = useUpdateWorkspace();
	const { isPending: isWorkspaceRemoving, mutate: workspaceRemove } = useDeleteWokspace();

	const id = useWorkspaceId();

	const handleUpdate = async () => {
		if (editValue === "") {
			return;
		}
		try {
			workspaceUpdate(
				{ workspaceId: id, name: editValue },
				{
					onSuccess: (data) => {
						toast.success("Updated successfully!");
						setvalue(editValue);
						setOpen(false);
						setisEdit(false);
					},
					onError: (err) => {
						toast.error("Something Went wrong");
					},
					onSetteled: () => {
						setOpen(false);
					},
				}
			);
		} catch (error) {
			console.log(error);
			toast.error("Something Went wrong");
		}
	};

	const handleRemoveWorkspace = async () => {
		const isConfirmed = await confirm({
			title: "Delete Item",
			description:
				"Are you sure you want to delete this item? This action cannot be undone.",
			confirmText: "Delete",
			cancelText: "Cancel",
		});

		if(!isConfirmed) {
			return false
		}

		try {
			workspaceRemove(
				{ workspaceId: id },
				{
					onSuccess: () => {
						toast.success("Successfully removed");
						setOpen(false);
						router.replace("/");
					},
					onError: () => {
						toast.error("Somenthing went wrong");
					},
				}
			);
		} catch (error) {
			console.log(error);
			toast.error("Sonemting went wrong");
		}
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<ConfirmationDialog />
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
								{!isEdit && (
									<p
										className="text-sm text-[#1264a3]"
										onClick={() => {
											seteditValue(
												value
											);
											setisEdit(
												true
											);
										}}
									>
										Edit
									</p>
								)}
								{isEdit && (
									<div className="flex gap-2">
										<p
											className="text-sm text-[#1264a3]"
											onClick={
												handleUpdate
											}
										>
											Update
										</p>
										<p
											className="text-sm text-rose-700"
											onClick={() => {
												setisEdit(
													false
												);
												seteditValue(
													initialValue
												);
											}}
										>
											Cancel
										</p>
									</div>
								)}
							</div>
							{!isEdit && (
								<p className="text-sm font-semibold mt-1 text-muted-foreground">
									{value}
								</p>
							)}
							{isEdit && (
								<Input
									disabled={
										isWorkspaceUpdating
									}
									value={editValue}
									onChange={(e) =>
										seteditValue(
											e.target
												.value
										)
									}
									className="mt-2 border-none focus:border-none ring-0 focus:ring-0"
								/>
							)}
						</div>

						{/*  */}
						{!isEdit && (
							<button
								disabled={false}
								onClick={handleRemoveWorkspace}
								className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
							>
								{isWorkspaceRemoving && (
									<Loader className="size-4 animate-spin" />
								)}
								<TrashIcon className="size-4" />
								<p className="text-sm text-rose-700">
									Delete workspace
								</p>
							</button>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}

export default PreferencesModal;
