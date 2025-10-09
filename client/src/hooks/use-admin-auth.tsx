import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Admin } from "@shared/schema";

export function useAdminAuth() {
  const { toast } = useToast();

  // Get current admin user
  const { data: admin, isLoading } = useQuery<Admin | null>({
    queryKey: ["/api/admin/me"],
    retry: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await apiRequest("POST", "/api/admin/login", credentials);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] });
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] });
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    },
  });

  return {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    login: loginMutation,
    logout: logoutMutation,
  };
}
