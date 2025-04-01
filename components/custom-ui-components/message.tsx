import React from "react";
import dynamic from "next/dynamic";

const Renderer = dynamic(() => import("@/components/custom-ui-components/renderer"), { ssr: false });


interface MessageProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
	isEditing: boolean;
	setIsEditing: () => void;
	isCompact: boolean;
	hideThreadButton: boolean;
	isAuthor: boolean;
}

function Message({
	data,
	isAuthor,
	isCompact,
	isEditing,
	setIsEditing,
	hideThreadButton,
	
}: MessageProps) {
	return <div>
        <Renderer value={data.body}/>
    </div>;
}

export default Message;
