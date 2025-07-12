import { ShippingAddress } from "@/types";

type ShippingAddressFormProps = {
  address?: ShippingAddress;
};

const ShippingAddressForm = ({ address }: ShippingAddressFormProps) => {
  return <div>{String(address)}</div>;
};

export default ShippingAddressForm;
