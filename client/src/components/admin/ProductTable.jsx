import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ProductTable = ({ products }) => {
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/admin/productForm", {
      state: {
        mode: "ADD",
      },
    });
  };

  const handleEdit = (product) => {
    navigate("/admin/productForm", {
      state: {
        product,
        mode: "EDIT",
      },
    });
  };

  const handleDelete = (productId) => {
    navigate("/admin/productForm", {
      state: {
        productId,
        mode: "DELETE",
      },
    });
  };
  return (
    <div className="border rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <Button onClick={handleAdd}>Add</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover"
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>₹{product.price}</TableCell>
              <TableCell>{product.category_name}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.is_available ? "Yes" : "No"}</TableCell>
              <TableCell className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1 hover:bg-blue-50"
                  onClick={() => handleEdit(product)}
                >
                  ✏️ Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  className="flex items-center gap-1"
                  onClick={() => handleDelete(product.id)}
                >
                  🗑️ Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTable;
