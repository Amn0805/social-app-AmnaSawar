// components/layout/Footer.jsx
export default function Footer() {
  return (
    <footer className="border-t border-ink/5 dark:border-surface-border mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-mutedLight dark:text-muted">
        <span className="font-display">
          Link<span className="text-brand-500">Up</span>
        </span>
        <span>Built with React, React Router & localStorage — no backend.</span>
      </div>
    </footer>
  );
}