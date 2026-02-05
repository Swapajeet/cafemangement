import { motion } from "framer-motion";
import { useSettings } from "@/hooks/use-settings";
import { useMenu } from "@/hooks/use-menu";
import { BookingForm } from "@/components/BookingForm";
import { MapLocation } from "@/components/MapLocation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Coffee, MapPin, Clock } from "lucide-react";

export default function Landing() {
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const { data: menu, isLoading: menuLoading } = useMenu();

  // Group menu by category
  const menuCategories = menu?.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menu>);

  const categories = Object.keys(menuCategories || {});

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          {/* Using a warm, cafe-themed unsplash image */}
          {/* Cafe interior warm lighting */}
          <img 
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop"
            alt="Cafe Ambience"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-2xl">
              Brune Cafe
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light tracking-wide mb-8">
              Coffee, Calm & Conversations
            </p>
            
            {/* Status Badge */}
            {!settingsLoading && settings && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-block"
              >
                <div className={`px-6 py-2 rounded-full border backdrop-blur-md ${
                  settings.isOpen 
                    ? "bg-green-500/20 border-green-500/50 text-green-100" 
                    : "bg-red-500/20 border-red-500/50 text-red-100"
                }`}>
                  <span className="flex items-center gap-2 font-medium">
                    <span className={`w-2.5 h-2.5 rounded-full ${settings.isOpen ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
                    {settings.isOpen ? "We are Open - Come on in!" : "Currently Closed"}
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 md:py-32 container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary/20 bg-primary/5">Our Offerings</Badge>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Curated For Your Taste
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            From artisanal brews to comforting bites, everything we serve is prepared with love and premium ingredients.
          </p>
        </div>

        {menuLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
          </div>
        ) : (
          <Tabs defaultValue={categories[0]} className="w-full">
            <div className="flex justify-center mb-12 overflow-x-auto pb-4">
              <TabsList className="h-auto p-1 bg-secondary/50 rounded-full">
                {categories.map(cat => (
                  <TabsTrigger 
                    key={cat} 
                    value={cat}
                    className="rounded-full px-6 py-2.5 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                  >
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {categories.map(cat => (
              <TabsContent key={cat} value={cat}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {menuCategories[cat].map(item => (
                    <Card key={item.id} className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border/50 overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                          <span className="font-mono font-bold text-lg text-primary">₹{item.price}</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {item.description || "A delightful choice for your palate."}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </section>

      {/* Info & Booking Section */}
      <section className="bg-secondary/30 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: Location & Hours */}
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl font-display font-bold mb-6">Visit Us</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Our Location</h4>
                      <p className="text-muted-foreground">123, Coffee Street, Indiranagar<br/>Bangalore, KA 560038</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Opening Hours</h4>
                      <p className="text-muted-foreground">Mon - Fri: 8:00 AM - 10:00 PM<br/>Sat - Sun: 9:00 AM - 11:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                      <Coffee className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Contact</h4>
                      <p className="text-muted-foreground">+91 98765 43210<br/>hello@brunecafe.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Component */}
              <MapLocation />
            </div>

            {/* Right: Booking Form */}
            <div className="lg:sticky lg:top-24">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Brune Cafe</h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Where every cup tells a story and every visit feels like coming home.
          </p>
          <div className="h-px w-24 bg-white/20 mx-auto mb-8" />
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Brune Cafe. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
