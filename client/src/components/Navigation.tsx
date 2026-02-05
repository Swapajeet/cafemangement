import { Link, useLocation } from "wouter";
import { Coffee, ShieldCheck, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  
  const isAdmin = location.startsWith("/admin");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
            <Coffee className="w-6 h-6" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight group-hover:text-primary transition-colors">
            Brune Cafe
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {!user ? (
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="hidden md:flex gap-2">
                <ShieldCheck className="w-4 h-4" />
                Staff Access
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium hidden sm:inline-block text-muted-foreground">
                Hi, {user.username}
              </span>
              {isAdmin ? (
                <Link href="/">
                  <Button variant="outline" size="sm">View Site</Button>
                </Link>
              ) : (
                <Link href="/admin">
                  <Button variant="default" size="sm">Dashboard</Button>
                </Link>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => logout()}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
