import { useState, useEffect } from "react";
import { roleService } from "@/services/role.service";
import { RoleDetailResponse } from "@/types/role";
import { useDebounce } from "@/hooks/useDebounce";

export function useRole() {
  const [roles, setRoles] = useState<RoleDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchRoles = async (search?: string) => {
    setIsLoading(true);
    try {
      const res = await roleService.getAll(search);
      setRoles(res.data?.data || []);
    } catch (e) {
      console.error(e);
      setRoles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles(debouncedSearch);
  }, [debouncedSearch]);

  const refresh = () => {
    fetchRoles(debouncedSearch);
  };

  return {
    roles,
    isLoading,
    searchQuery,
    setSearchQuery,
    refresh,
  };
}
