"use client";

import { useState } from "react";
import { useRole } from "@/hooks/useRole";
import { RoleDetailResponse } from "@/types/role";
import {
  CreateRoleModal,
  RolesHeader,
  RolesSearchBar,
  RolesTable,
  UpdateRoleModal,
} from "@/components/admin/roles";

export default function RolesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleDetailResponse | null>(null);
  const { roles, isLoading, searchQuery, setSearchQuery, refresh } = useRole();

  const handleEdit = (role: RoleDetailResponse) => {
    setSelectedRole(role);
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <RolesHeader totalCount={roles.length} onCreate={() => setIsCreateOpen(true)} />

      <RolesSearchBar
        searchQuery={searchQuery}
        onChange={setSearchQuery}
        onClear={() => setSearchQuery("")}
      />

      <RolesTable
        roles={roles}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onEdit={handleEdit}
      />

      <CreateRoleModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={refresh}
      />

      <UpdateRoleModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedRole(null);
        }}
        role={selectedRole}
        onSuccess={refresh}
      />
    </div>
  );
}
