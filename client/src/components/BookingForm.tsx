import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBookingSchema } from "@shared/schema";
import { useCreateBooking } from "@/hooks/use-bookings";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { CalendarIcon, Clock, Users } from "lucide-react";

export function BookingForm() {
  const mutation = useCreateBooking();
  
  const form = useForm({
    resolver: zodResolver(insertBookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      guests: 2,
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data, {
      onSuccess: () => form.reset(),
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl p-6 md:p-8 shadow-xl shadow-black/5 border border-border/50"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-display font-bold text-foreground">Reserve a Table</h3>
        <p className="text-muted-foreground">Join us for coffee, calm, and conversation.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} className="h-11 rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="hello@example.com" {...field} className="h-11 rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+91 98765 43210" {...field} className="h-11 rounded-lg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input type="date" {...field} className="h-11 rounded-lg pl-10" />
                    </FormControl>
                    <CalendarIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input type="time" {...field} className="h-11 rounded-lg pl-10" />
                    </FormControl>
                    <Clock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guests</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Select 
                        onValueChange={(val) => field.onChange(parseInt(val))} 
                        defaultValue={String(field.value)}
                      >
                        <SelectTrigger className="h-11 rounded-lg pl-10">
                          <SelectValue placeholder="Guests" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5,6,7,8].map(num => (
                            <SelectItem key={num} value={String(num)}>{num} People</SelectItem>
                          ))}
                          <SelectItem value="9">9+ (Contact us)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <Users className="absolute left-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg rounded-xl mt-4 font-bold bg-primary hover:bg-primary/90 transition-all"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Confirming..." : "Confirm Reservation"}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
