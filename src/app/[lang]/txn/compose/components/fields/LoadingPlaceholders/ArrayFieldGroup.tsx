/** Placeholder for when an array field group is loading */
export default function ArrayFieldGroup({ containerClass }: { containerClass?: string }) {
  return (
    <div className={containerClass}>
      <div className='skeleton h-24'></div>
      <div className='mt-6'>
        <div className='skeleton inline-block rounded-btn h-10 w-36'></div>
        <div className='skeleton inline-block rounded-btn h-10 w-36 ms-4'></div>
      </div>
    </div>
  );
}
