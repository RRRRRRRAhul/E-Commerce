import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/slice/category/categoryApi";

import { selectCategoryLoading } from "@/slice/category/categorySelector";

import { toast } from "sonner";

const CategoryModal = ({
  isOpen,
  onClose,
  mode, // "add" | "edit" | "delete"
  selectedCategory,
}) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectCategoryLoading);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  // Prefill
  useEffect(() => {
    if (mode === "edit" && selectedCategory) {
      setName(selectedCategory.name);
      setSlug(selectedCategory.slug || "");
    }
  }, [mode, selectedCategory]);

  // Reset
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setSlug("");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    try {
      if (mode === "add") {
        await dispatch(addCategory({ name, slug }));
        toast.success("Category added successfully 🎉");
      }

      if (mode === "edit" && selectedCategory) {
        await dispatch(
          updateCategory({
            id: selectedCategory.id,
            categoryData: { name, slug },
          }),
        );
        toast.success("Category updated successfully ✏️");
      }

      if (mode === "delete" && selectedCategory) {
        await dispatch(deleteCategory(selectedCategory.id));
        toast.success("Category deleted successfully 🗑️");
      }

      onClose();
    } catch (err) {
      // fallback (rare case)
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" && "Add Category"}
            {mode === "edit" && "Edit Category"}
            {mode === "delete" && "Delete Category"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add" && "Create a new category for your products."}
            {mode === "edit" && "Update category details."}
            {mode === "delete" && "This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {(mode === "add" || mode === "edit") && (
            <>
              <Input
                placeholder="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />

              <Input
                placeholder="Slug (optional)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={loading}
              />
            </>
          )}

          {mode === "delete" && (
            <p className="text-sm text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedCategory?.name}</span>?
            </p>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            variant={mode === "delete" ? "destructive" : "default"}
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                {mode === "add" && "Add"}
                {mode === "edit" && "Update"}
                {mode === "delete" && "Delete"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;
