"use client";

import { DollarSign } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { UploadBannerFieldForm } from "@/components/shared/products/upload-banner-field-form";
import { UploadImageFieldForm } from "@/components/shared/products/upload-image-field-form";
import { Input, InputWithIcon } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import type { AddProductForm } from "@/types";

type ProductFormProps = {
  form: UseFormReturn<AddProductForm>;
  onSubmit: (values: AddProductForm) => void;
};

export const CreateProductForm = ({ form, onSubmit }: ProductFormProps) => {
  return (
    <Form {...form}>
      <form id="user-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input className="!mt-0" placeholder="Enter a product name..." {...field} />
                </FormControl>
                <FormMessage className="font-normal" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input disabled className="!mt-0" {...field} />
                </FormControl>
                <FormMessage className="font-normal" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input className="!mt-0" placeholder="Enter a product category..." {...field} />
                </FormControl>
                <FormMessage className="font-normal" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input className="!mt-0" placeholder="Enter a product brand..." {...field} />
                </FormControl>
                <FormMessage className="font-normal" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <InputWithIcon icon={<DollarSign className="size-4" />} {...field} />
                </FormControl>
                <FormMessage className="font-normal" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input className="!mt-0" placeholder="Enter product stock..." {...field} />
                </FormControl>
                <FormMessage className="font-normal" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input className="!mt-0" placeholder="Enter a product description..." {...field} />
              </FormControl>
              <FormMessage className="font-normal" />
            </FormItem>
          )}
        />

        <UploadImageFieldForm form={form} />

        <div className="grid sm:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormLabel>Featured Product</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="!mt-0"
                  />
                </FormControl>
                <FormMessage className="font-normal" />
              </FormItem>
            )}
          />
        </div>

        {form.getValues("isFeatured") && <UploadBannerFieldForm form={form} />}
      </form>
    </Form>
  );
};
