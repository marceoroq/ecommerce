"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { ShippingAddress } from "@/types";
import { shippingAddressSchema } from "@/lib/validators";
import { updateUserAddressAction } from "@/lib/actions/user.actions";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { SHIPPING_ADDRESS_DEFAULT } from "@/lib/constants";

type ShippingAddressFormProps = {
  address?: ShippingAddress;
};

const ShippingAddressForm = ({ address }: ShippingAddressFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<ShippingAddress>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || SHIPPING_ADDRESS_DEFAULT,
  });

  async function onSubmit(values: ShippingAddress) {
    setIsLoading(true);

    const response = await updateUserAddressAction(values);

    if (!response.success) {
      toast.error("Failed to save shipping address", {
        description: String(response.message),
      });
      setIsLoading(false);
      return;
    }

    router.push("/payment-method");
  }

  return (
    <div className="max-w-md w-full mx-auto flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="h2-bold">Shipping Address</h1>
        <p className="text-sm text-muted-foreground">Please enter an address to ship to</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input className="!mt-0" placeholder="Joseph Key" {...field} />
                </FormControl>
                <FormMessage className="font-normal" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="streetAddress"
            render={({ field }) => (
              <FormItem className="!mt-6">
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input className="!mt-0" placeholder="St. Saint Thomas 123" {...field} />
                </FormControl>
                <FormMessage className="font-normal" />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="!mt-6 w-2/3">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input className="!mt-0" placeholder="Trelew" {...field} />
                  </FormControl>
                  <FormMessage className="font-normal" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem className="!mt-6 w-1/3">
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input className="!mt-0" placeholder="9100" {...field} />
                  </FormControl>
                  <FormMessage className="font-normal" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="!mt-6">
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input className="!mt-0" placeholder="Argentina" {...field} />
                </FormControl>
                <FormMessage className="font-normal" />
              </FormItem>
            )}
          />
          <Button className="mt-8 w-24" type="submit" disabled={isLoading}>
            {isLoading ? <Spinner /> : "Continue"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ShippingAddressForm;
