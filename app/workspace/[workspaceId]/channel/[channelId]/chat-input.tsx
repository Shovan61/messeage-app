import { useChannelId } from "@/components/hooks/use-channel-id";
import { useWorkspaceId } from "@/components/hooks/use-workspaceid";
import { Id } from "@/convex/_generated/dataModel";
import { useCreateMessage } from "@/features/messages/api/use-create-messages";
import { useGenerateUpload } from "@/features/upload/use-generate-upload";
import dynamic from "next/dynamic";
import Quill from "quill";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

const Editor = dynamic(() => import("@/components/custom-ui-components/editor"), { ssr: false });

interface CreateMessageValues {
	channelId: Id<"channels">;
	workspaceId: Id<"workspaces">;
	body: string;
	image: Id<"_storage"> | undefined;
}

interface ChatInputProps {
	placeholder: string;
}

function ChatInput({ placeholder }: ChatInputProps) {
	const editorRef = useRef<Quill | null>(null);
	const [isPending, setisPending] = useState(false);

	const { mutate: sendMessage } = useCreateMessage();
	const { mutate: generateImage } = useGenerateUpload();
	const workspaceId = useWorkspaceId();
	const channelId = useChannelId();

	const [editorKey, seteditorKey] = useState(0);

	const handleSubmit = async ({ body, image }: { body: string; image: File | null }) => {
		try {
			setisPending(true);
			editorRef.current?.enable(false);

			const values: CreateMessageValues = {
				workspaceId: workspaceId,
				channelId: channelId,
				body,
				image: undefined,
			};

			if (image) {
				const sendImageUrl = await generateImage({}, { throwError: true });

				if (!sendImageUrl) {
					throw new Error("Url not found!");
				}

				const results = await fetch(sendImageUrl, {
					method: "POST",
					headers: { "Content-Type": image.type },
					body: image,
				});

				if (!results.ok) {
					throw new Error("Failed to upload image");
				}

				const { storageId } = await results.json();

				values.image = storageId;
			}

			await sendMessage(values, {
				throwError: true,
			});

			seteditorKey((prev) => prev + 1);
		} catch (error) {
			console.log(error);
			toast.error("Failed to send!");
		} finally {
			setisPending(false);
			editorRef.current?.enable(true);
		}
	};

	return (
		<div className="px-5 w-full">
			<Editor
				key={editorKey}
				placeholder={placeholder}
				onSubmit={handleSubmit}
				innerRef={editorRef}
				disabled={isPending}
			/>
		</div>
	);
}

export default ChatInput;
