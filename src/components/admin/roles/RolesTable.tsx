"use client";

import { Shield, Loader2 } from "lucide-react";
import { RoleDetailResponse } from "@/types/role";
import RoleRow from "./RoleRow";
import { useI18n } from "@/contexts/I18nContext";

interface RolesTableProps {
  roles: RoleDetailResponse[];
  isLoading: boolean;
  searchQuery?: string;
  onEdit: (role: RoleDetailResponse) => void;
}

export default function RolesTable({
  roles,
  isLoading,
  onEdit,
}: RolesTableProps) {
  const { t } = useI18n();

  if (isLoading && roles.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-sm text-muted-foreground">
            {t("admin.common.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Shield className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-foreground">
          {t("admin.common.noData")}
        </h3>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th scope="col" className="px-6 py-3.5">
                {t("admin.roles.colRoleName")}
              </th>
              <th scope="col" className="px-6 py-3.5">
                {t("admin.roles.colDescription")}
              </th>
              <th scope="col" className="px-6 py-3.5">
                {t("admin.users.colCreatedAt")}
              </th>
              <th scope="col" className="px-6 py-3.5">
                {t("admin.common.update")}
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                {t("admin.roles.colActions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {roles.map((role) => (
              <RoleRow
                key={role.id}
                role={role}
                onEdit={onEdit}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
