import { Card, CardContent } from "@/components/ui/card";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthLayout;