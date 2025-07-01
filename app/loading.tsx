import { Spinner } from "@/components/shared/spinner";

export default function LoadingPage() {
  return (
    <div className="flex-center h-screen">
      <Spinner size={90} />
    </div>
  );
}
