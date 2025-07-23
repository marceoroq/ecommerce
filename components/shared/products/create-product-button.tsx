"use client";

import slugify from "slugify";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";

import { createProductAction } from "@/lib/actions/product.actions";

import { CreateProductForm } from "@/components/shared/products/create-product-form";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { createProductSchema } from "@/lib/validators";
import { AddProductForm } from "@/types";

export const CreateProductButton = () => {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<AddProductForm>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      slug: "",
      category: "",
      images: [""],
      brand: "",
      description: "",
      stock: 0,
      price: "",
      isFeatured: false,
      banner: null,
    },
  });

  // Automatically generate and update the slug field based on the current name input,
  // converting spaces to hyphens and making it lowercase for URL-friendly format.
  const name = form.watch("name");
  useEffect(() => {
    form.setValue("slug", slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g }));
  }, [name, form]);

  function onSubmit(values: AddProductForm) {
    startTransition(async () => {
      const response = await createProductAction(values);

      if (!response?.success) {
        toast.error(response?.message);
        setOpen(false);
        return;
      }

      form.reset();
      toast.success(response?.message);
      router.refresh();
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="min-w-36" variant="outline">
          <Plus />
          Create product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create product</DialogTitle>
          <DialogDescription>
            Complete all the product information. Click on save when you are done.
          </DialogDescription>
        </DialogHeader>

        <CreateProductForm form={form} onSubmit={onSubmit} />

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
