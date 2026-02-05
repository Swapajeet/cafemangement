import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useMenu() {
  return useQuery({
    queryKey: [api.menu.list.path],
    queryFn: async () => {
      const res = await fetch(api.menu.list.path);
      if (!res.ok) throw new Error("Failed to fetch menu");
      return api.menu.list.responses[200].parse(await res.json());
    },
  });
}
