import { IconMoodWink2 } from '@tabler/icons-react';

export default function Home() {
  return (
    <main className="prose bg-base-100 max-w-none min-h-screen p-4">
      <h1 className="text-primary text-center">
        <span className="align-middle">Hello!</span>
        <IconMoodWink2 strokeWidth={1} className="inline h-10 w-10 align-middle" />
      </h1>
    </main>
  )
}
