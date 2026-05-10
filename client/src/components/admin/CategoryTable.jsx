import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCategories,
  selectCategoryError,
} from "@/slice/category/categorySelector";
import { useEffect, useState } from "react";
import { getCategories } from "@/slice/category/categoryApi";
import CategoryModal from "./CategoryModal";
import { toast } from "sonner";

const CategoryTable = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const error = useSelector(selectCategoryError);

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState(null); // "add" | "edit" | "delete"
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // 🔥 Error Toast
  useEffect(() => {
    if (error) {
      toast.error(error, { duration: 4000 });
      dispatch(clearCategoryError());
    }
  }, [error, dispatch]);

  const handleAdd = () => {
    setMode("add");
    setSelectedCategory(null);
    setIsOpen(true);
  };

  const handleEdit = (category) => {
    setMode("edit");
    setSelectedCategory(category);
    setIsOpen(true);
  };

  const handleDelete = (category) => {
    setMode("delete");
    setSelectedCategory(category);
    setIsOpen(true);
  };

  return (
    <div className="border rounded-xl p-4">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Button onClick={handleAdd}>Add</Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.slug || "-"}</TableCell>

                <TableCell className="flex gap-2">
                  <Button size="sm" onClick={() => handleEdit(category)}>
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(category)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-gray-500">
                No categories found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <CategoryModal
        isOpen={isOpen}
        mode={mode}
        selectedCategory={selectedCategory}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default CategoryTable;