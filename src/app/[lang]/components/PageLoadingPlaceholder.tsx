/** Placeholder that indicates the page content is loading */
export default function PageLoadingPlaceholder() {
  return (
    <div className='my-20 text-center'>
      <span className='loading loading-bars w-16 text-primary'></span>
      <span className='loading loading-bars w-16 text-secondary'></span>
      <span className='loading loading-bars w-16 text-accent'></span>
    </div>
  );
}
