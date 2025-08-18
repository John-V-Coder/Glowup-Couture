import AdminOrdersView from "@/components/admin-view/orders";


import PageWrapper from "@/components/common/page-wrapper";
function AdminOrders() {
  return (
    <PageWrapper message="Loading orders...">
    <div>
      <AdminOrdersView />
    </div>
    </PageWrapper>
  );
}

export default AdminOrders;
