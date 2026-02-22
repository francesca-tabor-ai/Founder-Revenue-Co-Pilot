import { EntityCrudPage } from "@/components/admin/EntityCrudPage";

export default function AdminSubscriptionsPage() {
  return (
    <EntityCrudPage
      title="Subscriptions"
      apiPath="subscriptions"
      columns={[
        { key: "organization.name", label: "Organization" },
        { key: "plan.name", label: "Plan" },
        { key: "status", label: "Status" },
        { key: "currentPeriodStart", label: "Period Start" },
        { key: "currentPeriodEnd", label: "Period End" },
        { key: "createdAt", label: "Created" },
      ]}
      getId={(item) => (item.id as string) ?? ""}
    />
  );
}
