/** Placeholder for when a field with a "small" width is loading */
export default function SmallField({ containerClass }: { containerClass?: string }) {
  return (
    <div className={containerClass}>
      <div className='skeleton rounded-md h-4 max-w-xs mb-2'></div>
      <div className='skeleton rounded-md h-12 max-w-sm'></div>
    </div>
  );
}
