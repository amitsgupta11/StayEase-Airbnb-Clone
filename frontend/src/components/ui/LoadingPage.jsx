import Spinner from "./Spinner.jsx";
export default function LoadingPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg"/>
        <p className="mt-4 text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
