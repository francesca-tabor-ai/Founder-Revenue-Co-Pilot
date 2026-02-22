import { EntityCrudPage } from "@/components/admin/EntityCrudPage";

export default function AdminPlansPage() {
  return (
    <EntityCrudPage
      title="Plans"
      apiPath="plans"
      columns={[
        { key: "name", label: "Name" },
        { key: "type", label: "Type" },
        { key: "price", label: "Price" },
        { key: "currency", label: "Currency" },
        { key: "interval", label: "Interval" },
        { key: "createdAt", label: "Created" },
      ]}
      getId={(item) => (item.id as string) ?? ""}
    />
  );
}
