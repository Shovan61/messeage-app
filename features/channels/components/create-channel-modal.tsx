"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { useCreateChannel } from "../api/use-create-channel";

function CreateChannelModal() {
	const router = useRouter();
	const { isPending: isChanelCreationPending, mutate } = useCreateChannel();

	const [open, setOpen] = useCreateChannelModal();

	const [name, setname] = useState<string>("");

	const handleClose = () => {
		setOpen(false);
		setname("");
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			
		} catch (error) {
			console.log(error);
			
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
		setname(value);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a Channel</DialogTitle>
				</DialogHeader>

				<form action="submit" className="space-y-4" onSubmit={handleSubmit}>
					<Input
						disabled={false}
						required
						autoFocus
						minLength={3}
						onChange={(e) => handleChange(e)}
						value={name}
						placeholder="ex: my-channel"
					/>
					<div className="flex justify-end">
						<Button disabled={false}>Create</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default CreateChannelModal;
