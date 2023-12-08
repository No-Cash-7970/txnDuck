/** Placeholder for when an area-type field with a "large" width is loading */
export default function LargeAreaField({ containerClass }: { containerClass?: string }) {
  return (
    <div className={containerClass}>
      <div className='skeleton rounded-md h-4 max-w-xs mb-2'></div>
      <div className='skeleton rounded-md h-20 max-w-lg'></div>
    </div>
  );
}
