import { EntityCrudPage } from "@/components/admin/EntityCrudPage";

export default function AdminCustomersPage() {
  return (
    <EntityCrudPage
      title="Customers"
      apiPath="customers"
      columns={[
        { key: "email", label: "Email" },
        { key: "name", label: "Name" },
        { key: "organization.name", label: "Organization" },
        { key: "createdAt", label: "Created" },
      ]}
      getId={(item) => (item.id as string) ?? ""}
    />
  );
}
