import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="space-y-4 max-w-md">
                <h1 className="text-8xl font-black text-foreground tracking-tighter drop-shadow-sm">
                    404
                </h1>
                <h2 className="text-2xl font-bold tracking-tight">
                    Uncharted Territory
                </h2>
                <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                    You are treading on uncharted territory. The land you are looking for has not yet been discovered.
                </p>
            </div>

            <div className="pt-4">
                <Link href="/">
                    <Button
                        className="font--pressed"
                    >
                        Return to Base
                    </Button>
                </Link>
            </div>
        </div>
    );
}
