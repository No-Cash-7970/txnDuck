/** Placeholder skeleton when the sign-transaction button is loading */
export default function SignTxnLoading() {
  return (<>
    <div className='skeleton rounded-md h-[5em]'></div>
    <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 grid-rows-1 mx-auto mt-12'>
      <div className='skeleton rounded-md h-12'></div>
      <div className='skeleton rounded-md h-12'></div>
    </div>
  </>);
}
