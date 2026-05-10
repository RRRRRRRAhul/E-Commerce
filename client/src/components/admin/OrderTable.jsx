import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "@/slice/order/orderApi";
import { toast } from "sonner";

const getAvailableActions = (status) => {
  switch (status) {
    case "PENDING":
      return ["CONFIRMED", "CANCELLED"];

    case "CONFIRMED":
      return ["SHIPPED", "CANCELLED"];

    case "SHIPPED":
      return ["DELIVERED"];

    default:
      return [];
  }
};

const OrderTable = ({ orders }) => {
  const dispatch = useDispatch();
  const handleStatusUpdate = async (orderId, newStatus) => {
    const result = await dispatch(updateOrderStatus(orderId, newStatus));
    if (result.success) {
      toast.success("Order status updated successfully");
    } else {
      toast.error(result.message || "Failed to update order status");
    }
  };

  return (
    <div className="border rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-4">Orders</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order) => {
            const availableActions = getAvailableActions(order.status);
            return (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.user_email}</TableCell>
                <TableCell>₹{order.total_price}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "PENDING"
                        ? "warning"
                        : order.status === "CONFIRMED"
                          ? "success"
                          : "default"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {availableActions.map((action) => (
                      <Button
                        key={action}
                        size="sm"
                        onClick={() =>
                          handleStatusUpdate(order.id, action)
                        }
                      >
                        {action}
                      </Button>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable;