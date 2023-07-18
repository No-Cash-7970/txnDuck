import { IconMoodWink2 } from '@tabler/icons-react';

export default function Home() {
  return (
    <main className="prose bg-base-100 max-w-none min-h-screen p-4">
      <h1 className="text-primary text-center">
        <span className="align-middle">Hello!</span>
        <IconMoodWink2 strokeWidth={2} className="inline h-10 w-10 align-middle ms-2" />
      </h1>
      <p className="max-w-4xl px-4 mx-auto text-center">
        txn<span className="text-primary">Duck</span> will be coming soon!
      </p>
      <p className="max-w-4xl px-4 mx-auto text-center italic">
        Check out the <code className='p-0'>code</code> on <a href="https://github.com/No-Cash-7970/txnDuck">Github</a>.
      </p>
      <p className="max-w-4xl px-4 mx-auto text-center font-emoji text-8xl mt-8">
        🦆
      </p>
    </main>
  );
};
