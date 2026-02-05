import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertBooking } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useBookings() {
  return useQuery({
    queryKey: [api.bookings.list.path],
    queryFn: async () => {
      const res = await fetch(api.bookings.list.path);
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return api.bookings.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertBooking) => {
      const res = await fetch(api.bookings.create.path, {
        method: api.bookings.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create booking");
      }
      
      return api.bookings.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.bookings.list.path] });
      toast({
        title: "Booking Request Sent!",
        description: "We'll confirm your table shortly via email.",
      });
    },
    onError: (err) => {
      toast({
        title: "Booking Failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'pending' | 'accepted' | 'rejected' }) => {
      const url = buildUrl(api.bookings.updateStatus.path, { id });
      const res = await fetch(url, {
        method: api.bookings.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      
      if (!res.ok) throw new Error("Failed to update status");
      return api.bookings.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.bookings.list.path] });
      toast({
        title: "Status Updated",
        description: `Booking marked as ${data.status}.`,
      });
    },
    onError: (err) => {
      toast({
        title: "Update Failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });
}
