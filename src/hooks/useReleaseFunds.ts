import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTrustlessWorkClient } from "../provider";
import {
  SingleReleaseReleaseFundsPayload,
  MultiReleaseReleaseFundsPayload,
} from "../types/types.payload";
import { EscrowType } from "../types/types";

/**
 * Use the useReleaseFunds hook to release funds from an escrow.
 * @returns A mutation function to release funds from an escrow.
 */
export function useReleaseFunds() {
  const client = useTrustlessWorkClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      payload,
      type,
    }: {
      payload:
        | SingleReleaseReleaseFundsPayload
        | MultiReleaseReleaseFundsPayload;
      type: EscrowType;
    }) => client.releaseFunds(payload, type),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["escrows"] });
    },
  });

  return {
    releaseFunds: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    unsignedTransaction: mutation.data?.unsignedTransaction,
  };
}
