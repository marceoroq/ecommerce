import { usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Spinner } from "@/components/shared/spinner";

export const PayPalLoadingStatus = () => {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  if (!isPending && !isRejected) return null;

  return (
    <div className="w-full flex justify-center">
      {isPending && <Spinner className="size-8" />}
      {isRejected && (
        <p className="w-full py-1 text-sm text-center text-red-500 border border-red-300 bg-red-100 px-4 rounded-full">
          Error Loading PayPal
        </p>
      )}
    </div>
  );
};
