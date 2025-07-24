import Image from "next/image";
import { X } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { UploadButton } from "@/lib/uploadthing";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UploadImageFieldForm = ({ form }: { form: any }) => {
  return (
    <FormField
      control={form.control}
      name="images"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Images</FormLabel>

          <Card className="p-2 rounded-md">
            <div className="flex gap-3">
              {field.value!.map((image: string) =>
                image.length > 0 ? (
                  <div key={image} className="relative">
                    <Image
                      className="border w-24 h-24 rounded-md object-cover"
                      width={300}
                      height={300}
                      src={image}
                      alt={image}
                    />
                    <button
                      type="button" // this is to avoid capture enter event inside dialog form
                      className="absolute -top-1 bg-background -right-2 border rounded-full"
                      onClick={() =>
                        form.setValue(
                          "images",
                          field.value!.filter((img: string) => img !== image)
                        )
                      }
                    >
                      <X className="size-4 p-0.5" />
                    </button>
                  </div>
                ) : (
                  <p key={image} className="text-gray-400 text-sm">
                    Not images uploaded yet
                  </p>
                )
              )}
              <FormControl className="inline p-3 pb-5 rounded-md border">
                <UploadButton
                  className="object-cover"
                  endpoint="imageUploader"
                  onClientUploadComplete={(res: { url: string }[]) =>
                    form.setValue("images", [...field.value!, res[0].url])
                  }
                  onUploadError={(error: Error) => {
                    toast.error("Error uploading images", { description: error.message });
                  }}
                />
              </FormControl>
            </div>
          </Card>
          <FormMessage className="font-normal" />
        </FormItem>
      )}
    />
  );
};
