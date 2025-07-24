"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";

type SearchInputProps = {
  placeholder?: string;
  defaultValue?: string;
};

export function SearchInput({ placeholder = "Search by name", defaultValue }: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState(defaultValue || "");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const params = new URLSearchParams(searchParams);

      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }

      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <Input
      type="text"
      name="search"
      placeholder={placeholder}
      className="border w-52 rounded-md px-3 py-1 text-sm"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
}
