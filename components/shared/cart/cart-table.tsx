import { CartItem } from "@/types";

type CartTableProps = {
  cartItems: CartItem[];
};

const CartTable = ({ cartItems }: CartTableProps) => {
  return (
    <div>
      {cartItems.map((item) => (
        <div key={item.productId}>
          {item.quantity} - {item.name}
        </div>
      ))}
    </div>
  );
};

export default CartTable;
