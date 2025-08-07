export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-6 h-6 border-2 border-neutral-500 border-t-neutral-200 rounded-full animate-spin" />
    </div>
  );
}