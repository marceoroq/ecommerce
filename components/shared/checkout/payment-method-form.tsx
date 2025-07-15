"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { SiPaypal } from "react-icons/si";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { FaRegCreditCard, FaMoneyBillWave } from "react-icons/fa6";

import { PaymentMethod } from "@/types";
import { paymentMethodSchema } from "@/lib/validators";
import { updateUserPaymentMethodAction } from "@/lib/actions/user.actions";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/spinner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { PAYMENT_METHOD_DEFAULT } from "@/lib/constants";

type PaymentMethodFormProps = {
  paymentMethod?: string | null;
};

const PaymentMethodForm = ({ paymentMethod }: PaymentMethodFormProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: { type: paymentMethod || PAYMENT_METHOD_DEFAULT },
  });

  function onSubmit(value: PaymentMethod) {
    startTransition(async () => {
      const response = await updateUserPaymentMethodAction(value);
      if (!response.success) {
        toast.error("Failed to save payment method", {
          description: String(response.message),
        });
      }
    });
  }

  return (
    <div className="max-w-xs w-full mx-auto flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="h2-bold">Payment Method</h1>
        <p className="text-sm text-muted-foreground">
          Please confirm a payment method to continue
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col gap-2"
                  >
                    <FormItem className="flex p-3 items-center justify-between gap-3 hover:bg-foreground/10 rounded-md">
                      <div className="flex gap-2 items-center">
                        <FaRegCreditCard className="size-5" />
                        <FormLabel className="font-normal cursor-pointer">
                          Credit Card {"(Stripe)"}
                        </FormLabel>
                      </div>
                      <FormControl>
                        <RadioGroupItem
                          className="border-gray-400 !mt-0"
                          value="stripe"
                        />
                      </FormControl>
                    </FormItem>

                    <FormItem className="flex p-3 items-center justify-between gap-3 hover:bg-foreground/10 rounded-md">
                      <div className="flex gap-2 items-center">
                        <SiPaypal className="size-5" />
                        <FormLabel className="font-normal cursor-pointer">
                          PayPal
                        </FormLabel>
                      </div>
                      <FormControl>
                        <RadioGroupItem
                          className="border-gray-400 !mt-0"
                          value="paypal"
                        />
                      </FormControl>
                    </FormItem>

                    <FormItem className="flex p-3 items-center justify-between gap-3 hover:bg-foreground/10 rounded-md">
                      <div className="flex gap-2 items-center">
                        <FaMoneyBillWave className="size-5" />
                        <FormLabel className="font-normal cursor-pointer">
                          Cash On Delivery
                        </FormLabel>
                      </div>
                      <FormControl>
                        <RadioGroupItem
                          className="border-gray-400 !mt-0"
                          value="cash"
                        />
                      </FormControl>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-8 w-24" type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : "Continue"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PaymentMethodForm;
