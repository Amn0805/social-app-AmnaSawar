// components/chat/MediaPreview.jsx
export default function MediaPreview({ file, onRemove }) {
  if (!file) return null;

  return (
    <div className="relative inline-block mb-2">
      {file.type === 'image' ? (
        <img src={file.dataUrl} alt="Preview" className="h-20 rounded-lg object-cover" />
      ) : (
        <video src={file.dataUrl} className="h-20 rounded-lg" />
      )}
      <button
        onClick={onRemove}
        aria-label="Remove attachment"
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-ink/70 text-white text-xs grid place-items-center hover:bg-ink/90 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}