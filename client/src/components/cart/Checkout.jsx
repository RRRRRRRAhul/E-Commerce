import { Button } from "@/components/ui/button";
import {useNavigate} from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="space-y-3">
      <Button className="w-full" onClick={handleCheckout}>
        Proceed to Checkout
      </Button>
    </div>
  );
};

export default Checkout;