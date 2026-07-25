// components/friends/RequestBadge.jsx
export default function RequestBadge({ count }) {
  if (!count || count <= 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full min-w-[1.1rem] h-[1.1rem] flex items-center justify-center px-1">
      {count > 9 ? '9+' : count}
    </span>
  );
}