import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const SidebarContent = ({ setSideBarSection }) => (
  <div className="flex flex-col gap-4 p-4">
    <Button variant="ghost" onClick={() => setSideBarSection("dashboard")}>
      Dashboard
    </Button>
    <Button variant="ghost" onClick={() => setSideBarSection("products")}>
      Products
    </Button>
    <Button variant="ghost" onClick={() => setSideBarSection("orders")}>
      Orders
    </Button>
    <Button variant="ghost" onClick={() => setSideBarSection("categories")}>
      Categories
    </Button>
  </div>
);

const AdminSidebar = ({ setSideBarSection }) => {
  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>

          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Admin Menu</SheetTitle>
              <SheetDescription>
                Navigate between dashboard, products, orders, and categories.
              </SheetDescription>
            </SheetHeader>

            {/* Sidebar Content */}
            <SidebarContent setSideBarSection={setSideBarSection} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 border-r min-h-screen">
        <SidebarContent setSideBarSection={setSideBarSection} />
      </div>
    </>
  );
};

export default AdminSidebar;
