import dynamic from "next/dynamic";
import Quill from "quill";
import React, { useRef } from "react";

const Editor = dynamic(() => import("@/components/custom-ui-components/editor"), { ssr: false });

interface ChatInputProps {
	placeholder: string;
}

function ChatInput({ placeholder }: ChatInputProps) {
	const editorRef = useRef<Quill | null>(null);

	const handleSubmit = ({ body, image }: { body: string; image: File | null }) => {
		console.log(body, image);
	};

	return (
		<div className="px-5 w-full">
			<Editor
				placeholder={placeholder}
				onSubmit={handleSubmit}
				innerRef={editorRef}
				disabled={false}
			/>
		</div>
	);
}

export default ChatInput;
