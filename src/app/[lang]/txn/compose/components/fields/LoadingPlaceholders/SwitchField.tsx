/** Placeholder for when a switch-type field is loading */
export default function SwitchField({ containerClass }: { containerClass?: string }) {
  return (
    <div className={`flex justify-between items-center ${containerClass}`}>
      <div className='skeleton rounded-md h-4 w-48'></div>
      <div className='skeleton rounded-full h-7 w-16'></div>
    </div>
  );
}
