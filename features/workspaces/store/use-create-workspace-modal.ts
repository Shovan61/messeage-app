import { atom } from "jotai";
import { useAtom } from "jotai";

const modalState = atom(false);

export const useCreateWorkspaceModal = () => {
	return useAtom(modalState);
};
