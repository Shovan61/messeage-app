import dynamic from "next/dynamic";
import Quill from "quill";
import React, { useRef } from "react";

const Editor = dynamic(() => import("@/components/custom-ui-components/editor"), { ssr: false });

interface ChatInputProps {
	placeholder: string;
}

function ChatInput({ placeholder }: ChatInputProps) {
	const editorRef = useRef<Quill | null>(null);

	return (
		<div className="px-5 w-full">
			<Editor
				placeholder={placeholder}
				onSubmit={() => {}}
				innerRef={editorRef}
				disabled={false}
              
			/>
		</div>
	);
}

export default ChatInput;
