import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center space-y-8">
      <div>
        <Image src="/icon.svg" alt="Flags" width={100} height={100} />
      </div>
      <div className="space-y-4 max-w-md">
        <h1 className="text-8xl font-black text-foreground tracking-tighter drop-shadow-sm">404</h1>
        <h2 className="text-2xl font-bold tracking-tight">Unregistered Country</h2>
        <p className="text-muted-foreground font-mono text-sm leading-relaxed">
          You found an unregistered country. Please don't tell anyone about this.
        </p>
      </div>

      <div className="pt-4 flex items-center justify-center gap-4">
        <Link href="/">
          <Button className="font-pressed">Back to Home</Button>
        </Link>
        <Link href="/flags">
          <Button className="font-pressed bg-blue-500" variant="outline">
            Flags
          </Button>
        </Link>
      </div>
    </div>
  );
}
