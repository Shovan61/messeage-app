import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Loader, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirmModal } from "@/components/hooks/use-confirm";
import { Input } from "@/components/ui/input";
import { useChannelId } from "@/components/hooks/use-channel-id";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useWorkspaceId } from "@/components/hooks/use-workspaceid";
import { useDeleteChannel } from "@/features/channels/api/use-delete-channel";
import { useCurrentMember } from "@/features/members/api/use-current-member";

interface HeaderProps {
	channelName: string;
}

function Header({ channelName }: HeaderProps) {
	const channelID = useChannelId();
	const workspaceId = useWorkspaceId();
	const { data: memberData } = useCurrentMember({ workspaceId });

	const router = useRouter();

	const { ConfirmationDialog, confirm } = useConfirmModal();

	const [value, setvalue] = useState(channelName);
	const [isEdit, setisEdit] = useState<boolean>(false);
	const [editValue, seteditValue] = useState<string>(channelName);
	const isAdmin = memberData?.role === "admin";

	const { mutate, isPending } = useUpdateChannel();
	const { mutate: deleteChannelApi, isPending: isDeletePending } = useDeleteChannel();

	const handleUpdate = async () => {
		if (editValue === "") {
			return;
		}
		try {
			mutate(
				{ channelID: channelID, name: editValue },
				{
					onSuccess(id) {
						toast.success("Updated successfully!");
						setvalue(editValue);
						router.push(
							`/workspace/${workspaceId}/channel/${id}`
						);
						setisEdit(false);
					},
					onError(err) {
						toast.error("Something Went wrong");
						console.log(err);
					},
				}
			);
		} catch (error) {
			console.log(error);
			toast.error("Something Went wrong");
		}
	};

	const handleDelete = async () => {
		const isConfirmed = await confirm({
			title: "Delete Item",
			description:
				"Are you sure you want to delete this item? This action cannot be undone.",
			confirmText: "Delete",
			cancelText: "Cancel",
		});

		if (!isConfirmed) {
			return false;
		}

		try {
			deleteChannelApi(
				{ channelId: channelID },
				{
					onSuccess: () => {
						toast.success("Successfully removed");
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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
		seteditValue(value);
	};

	return (
		<div className="bg-white border-b h-[48px] flex items-center px-4 overflow-hidden">
			<ConfirmationDialog />
			<Dialog>
				<DialogTrigger asChild>
					<Button
						variant={"ghost"}
						className="text-lg font-semibold px-2 overflow-hidden w-auto"
					>
						<span className="truncate"># {channelName}</span>
						<FaChevronDown className="size-2.5 ml-2" />
					</Button>
				</DialogTrigger>
				<DialogContent className="p-0 bg-gray-50 overflow-hidden">
					<DialogHeader className="p-4 border-b bg-white">
						<DialogTitle>{channelName}</DialogTitle>
					</DialogHeader>
					{isDeletePending && (
						<div className="w-full flex items-center justify-center">
							<Loader className="animate-spin text-muted-foreground size-6" />
						</div>
					)}
					{!isDeletePending && (
						<div className="px-5 pb-4 flex flex-col gap-y-2">
							<div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
								<div className="flex items-center justify-between">
									<p className="text-sm font-semibold">
										Channel Name
									</p>
									{!isEdit && isAdmin && (
										<p
											className="text-sm text-[#1264a3] hover:underline font-semibold"
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
								</div>
								{!isEdit && (
									<p className="text-xs">
										# {channelName}
									</p>
								)}

								{isEdit && (
									<div className="flex items-center justify-between gap-3">
										<Input
											disabled={
												isPending
											}
											value={
												editValue
											}
											onChange={(
												e
											) =>
												handleChange(
													e
												)
											}
											className="mt-2 border-none focus:border-none ring-0 focus:ring-0"
										/>

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
														channelName
													);
												}}
											>
												Cancel
											</p>
										</div>
									</div>
								)}
							</div>
							{!isEdit && isAdmin && (
								<button
									className="flex items-center gap-x-2 p-2 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600 "
									onClick={handleDelete}
								>
									<TrashIcon className="size-4 " />
									<p className="text-sm font-semibold">
										Delete channel
									</p>
								</button>
							)}
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default Header;
