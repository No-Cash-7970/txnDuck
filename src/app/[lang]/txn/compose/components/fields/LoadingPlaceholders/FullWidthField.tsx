/** Placeholder for when a field with a "full" width is loading */
export default function FullWidthField({ containerClass }: { containerClass?: string }) {
  return (
    <div className={containerClass}>
      <div className='skeleton rounded-md h-4 max-w-xs mb-2'></div>
      <div className='skeleton rounded-md h-12'></div>
    </div>
  );
}
