// components/ui/Avatar.jsx
import clsx from 'clsx';
import { getInitial, getAvatarColor } from '../../utils/helpers';

const SIZES = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-base',
  lg: 'w-20 h-20 text-2xl',
};

export default function Avatar({ src, name, size = 'md', pulse = false, className }) {
  const dimension = SIZES[size];

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'avatar'}
        className={clsx(
          dimension,
          'rounded-full object-cover shrink-0 ring-2 ring-white dark:ring-surface',
          pulse && 'animate-pulseRing',
          className
        )}
      />
    );
  }

  return (
    <div
      style={{ backgroundColor: getAvatarColor(name) }}
      className={clsx(
        dimension,
        'rounded-full grid place-items-center text-white font-semibold font-display shrink-0',
        pulse && 'animate-pulseRing',
        className
      )}
    >
      {getInitial(name)}
    </div>
  );
}
