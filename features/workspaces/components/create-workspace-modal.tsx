"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function CreateWorkspaceModal() {
	const router = useRouter();
	const [open, setOpen] = useCreateWorkspaceModal();
	const [name, setname] = useState<string>("");
	const { mutate, isPending } = useCreateWorkspace();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			mutate(
				{
					name: name,
				},
				{
					onSuccess(id) {
						handleClose();
						router.push(`/workspace/${id}`);
						toast.success("Workspace has been created.");
					},
				}
			);
		} catch (error) {
			console.log(error);
		}
	};

	const handleClose = () => {
		setname("");
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a workspace</DialogTitle>
				</DialogHeader>

				<form action="submit" className="space-y-4" onSubmit={handleSubmit}>
					<Input
						disabled={isPending}
						required
						autoFocus
						minLength={3}
						onChange={(e) => setname(e.target.value)}
						value={name}
						placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
					/>
					<div className="flex justify-end">
						<Button disabled={isPending}>Create</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default CreateWorkspaceModal;
