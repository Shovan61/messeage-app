import { atom } from "jotai";
import { useAtom } from "jotai";

const modalState = atom(false);

export const useCreateChannelModal = () => {
    return useAtom(modalState);
};
