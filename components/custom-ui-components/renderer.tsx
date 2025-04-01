import Quill from "quill";
import React, { useRef, useState, useEffect } from "react";

interface RendererProps {
	value: string;
}

function Renderer({ value }: RendererProps) {
	const [isEmpty, setIsEmpty] = useState(false);
	const rendereRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		try {
			const contents = JSON.parse(value); // This might be failing!
			const container = rendereRef.current;
			if (!container) return;

			const quill = new Quill(document.createElement("div"), {
				theme: "snow",
			});
			quill.enable(false);
			quill.setContents(contents);

			const isEmpty = quill.getText().trim().length === 0;
			setIsEmpty(isEmpty);

			container.innerHTML = quill.root.innerHTML;
		} catch (error) {
			console.error("Error in useEffect:", error);
		}
	}, [value]);

	if (isEmpty) {
		return null;
	}

	return <div ref={rendereRef} className="ql-editor ql-renderer"></div>;
}

export default Renderer;
