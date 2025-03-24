import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";

type RequestType = { channelId: Id<"channels"> };
type ResponseType = Id<"channels"> | null;

type Options = {
    onSuccess?: (data: ResponseType) => void;
    onError?: (error: Error) => void;
    onSetteled?: () => void;
    throwError?: boolean;
};

export const useDeleteChannel = () => {
    const mutation = useMutation(api.channels.deleteChannel);

    const [error, seterror] = useState<Error | null>(null);
    const [status, setstatus] = useState<"success" | "error" | "pending" | "setteled" | null>(
        null
    );

    const isSuccess = useMemo(() => status === "success", [status]);
    const isError = useMemo(() => status === "error", [status]);
    const isSetteled = useMemo(() => status === "setteled", [status]);
    const isPending = useMemo(() => status === "pending", [status]);

    const mutate = useCallback(
        async (value: RequestType, options: Options) => {
            try {
                setstatus("pending");

                seterror(null);

                const response = await mutation(value);

                setstatus("success");
                options?.onSuccess?.(response);
                return response;
            } catch (error) {
                setstatus("error");
                options?.onError?.(error as Error);
            } finally {
                options?.onSetteled?.();
                setstatus("setteled");
            }
        },
        [mutation]
    );

    return { mutate, isPending, isSetteled, isSuccess, isError, error };
};
