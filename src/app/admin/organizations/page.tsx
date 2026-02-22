import { EntityCrudPage } from "@/components/admin/EntityCrudPage";

export default function AdminOrganizationsPage() {
  return (
    <EntityCrudPage
      title="Organizations"
      apiPath="organizations"
      columns={[
        { key: "name", label: "Name" },
        { key: "slug", label: "Slug" },
        { key: "owner.email", label: "Owner" },
        { key: "createdAt", label: "Created" },
      ]}
      getId={(item) => (item.id as string) ?? ""}
    />
  );
}
