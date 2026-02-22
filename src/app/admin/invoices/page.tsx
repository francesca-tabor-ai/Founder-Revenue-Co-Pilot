import { EntityCrudPage } from "@/components/admin/EntityCrudPage";

export default function AdminInvoicesPage() {
  return (
    <EntityCrudPage
      title="Invoices"
      apiPath="invoices"
      columns={[
        { key: "number", label: "Number" },
        { key: "amount", label: "Amount" },
        { key: "currency", label: "Currency" },
        { key: "status", label: "Status" },
        { key: "organization.name", label: "Organization" },
        { key: "createdAt", label: "Created" },
      ]}
      getId={(item) => (item.id as string) ?? ""}
    />
  );
}
