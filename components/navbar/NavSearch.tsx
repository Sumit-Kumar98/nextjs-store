"use client";

import { useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";

const NavSearch = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search");
  const { replace } = useRouter();

  const [search, setSearch] = useState(searchTerm?.toString() || "");

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    replace(`/products?${params.toString()}`);
  }, 500);

  useEffect(() => {
    if (!searchParams.get("search")) {
      setSearch("");
    }
  }, [searchTerm]);

  return (
    <Input
      type="search"
      placeholder="search product"
      className="max-w-xs dark:bg-muted"
      onChange={(e) => {
        setSearch(e.target.value);
        handleSearch(e.target.value);
      }}
      value={search}
    />
  );
};

export default NavSearch;
