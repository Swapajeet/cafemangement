import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Coffee } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="mb-8 p-6 bg-secondary/50 rounded-full">
        <Coffee className="w-16 h-16 text-primary" />
      </div>
      <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        Oops! Looks like this page hasn't been brewed yet.
      </p>

      <Link href="/">
        <Button size="lg" className="font-bold rounded-full px-8">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
