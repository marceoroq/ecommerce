"use client";

import slugify from "slugify";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";

import { updateProductAction } from "@/lib/actions/product.actions";
import { delay } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/spinner";
import { EditProductForm } from "@/components/shared/products/edit-product-form";
import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

import { Product, UpdateProductForm } from "@/types";
import { updateProductSchema } from "@/lib/validators";

export const EditProductButton = ({ product }: { product: Product }) => {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateProductForm>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      images: product.images || [],
      brand: product.brand,
      description: product.description,
      stock: product.stock,
      price: product.price,
      isFeatured: product.isFeatured,
      banner: product.banner,
    },
  });

  const name = form.watch("name") || product.name;
  useEffect(() => {
    form.setValue("slug", slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g }));
  }, [name, form]);

  function onSubmit(values: UpdateProductForm) {
    startTransition(async () => {
      const response = await updateProductAction(product.id, values);

      if (!response?.success) {
        toast.error(response?.message);
        setOpen(false);
        return;
      }

      toast.success(response?.message);
      router.refresh();
      setOpen(false);
    });
  }

  async function handleOpenChange(open: boolean) {
    setOpen(open);

    if (!open) {
      // The delay is added because the dialog closing involves an animation.
      // This prevents the form from resetting visibly before the dialog fully closes.
      await delay(200);
      form.reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="size-6" variant="outline">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit product</DialogTitle>
          <DialogDescription>
            Edit product information. Click on save when you are done.
          </DialogDescription>
        </DialogHeader>

        <EditProductForm form={form} onSubmit={onSubmit} />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="user-form" disabled={isPending}>
            {isPending ? <Spinner /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
