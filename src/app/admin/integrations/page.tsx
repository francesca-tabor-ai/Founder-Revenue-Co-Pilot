import { EntityCrudPage } from "@/components/admin/EntityCrudPage";

export default function AdminIntegrationsPage() {
  return (
    <EntityCrudPage
      title="Integrations"
      apiPath="integrations"
      columns={[
        { key: "name", label: "Name" },
        { key: "type", label: "Type" },
        { key: "organization.name", label: "Organization" },
        {
          key: "isActive",
          label: "Active",
          render: (val) => (val ? "Yes" : "No"),
        },
        { key: "createdAt", label: "Created" },
      ]}
      getId={(item) => (item.id as string) ?? ""}
    />
  );
}
