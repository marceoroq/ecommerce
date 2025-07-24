import Image from "next/image";
import { X } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { UploadButton } from "@/lib/uploadthing";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UploadBannerFieldForm = ({ form }: { form: any }) => {
  return (
    <FormField
      control={form.control}
      name="banner"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Banner</FormLabel>

          <Card className="p-2 rounded-md">
            <div className="flex gap-3">
              {field.value && field.value.length > 0 ? (
                <div className="relative w-full">
                  <Image
                    className="border w-full rounded-md object-cover"
                    width={900}
                    height={300}
                    quality={100}
                    src={field.value}
                    alt={field.value}
                  />
                  <button
                    type="button" // this is to avoid capture enter event inside dialog form
                    className="absolute -top-1 bg-background -right-2 border rounded-full"
                    onClick={() => form.setValue("banner", null)}
                  >
                    <X className="size-4 p-0.5" />
                  </button>
                </div>
              ) : (
                <FormControl className="inline p-3 pb-5 rounded-md border">
                  <UploadButton
                    className="object-cover w-full"
                    endpoint="imageUploader"
                    onClientUploadComplete={(res: { url: string }[]) =>
                      form.setValue("banner", res[0].url)
                    }
                    onUploadError={(error: Error) => {
                      toast.error("Error uploading image", { description: error.message });
                    }}
                  />
                </FormControl>
              )}
            </div>
          </Card>
          <FormMessage className="font-normal" />
        </FormItem>
      )}
    />
  );
};
