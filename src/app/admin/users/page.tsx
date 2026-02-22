import { EntityCrudPage } from "@/components/admin/EntityCrudPage";

export default function AdminUsersPage() {
  return (
    <EntityCrudPage
      title="Users"
      apiPath="users"
      columns={[
        { key: "email", label: "Email" },
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
        { key: "createdAt", label: "Created" },
      ]}
      getId={(item) => (item.id as string) ?? ""}
    />
  );
}
