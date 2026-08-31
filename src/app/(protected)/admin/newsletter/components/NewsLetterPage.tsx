"use client";

import { useCallback, useEffect, useState } from "react";
import RefreshButton from "@/app/(protected)/dashboard/components/RefreshButton";
import { Table, type TableColumn } from "@/components/table";

interface Newsletter {
  id: string;
  email: string;
  status: string;
  unsubscribeToken: string;
  subscribedAt: string;
  unsubscribedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const NewsLetterPage = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    const match = document.cookie.split("; ").find((row) => row.startsWith("auth-token="));
    return match?.split("=")[1] || null;
  };

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newsletter`, {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch newsletters");

      const data: Newsletter[] = await res.json();
      setNewsletters(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Define columns for the table
  const columns: TableColumn<Newsletter>[] = [
    {
      key: "email",
      header: "Email",
      render: (item) => (
        <span className="">
          {item.email}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.status === "subscribed" ? "text-success" : "text-slate-gray"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "subscribedAt",
      header: "Subscribed At",
      render: (item) => new Date(item.subscribedAt).toLocaleString(),
    },
  ];

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-lg lg:text-2xl text-text-dark dark:text-sidebar-accent-foreground font-medium tracking-tight">
          News Letters
        </h1>

        <p className="text-muted-foreground text-sm mt-1">
          View and manage all newsletter subscribers, track sign-ups, and keep
          your audience engaged with the latest updates.
        </p>
      </div>

      <div className="rounded-2xl border overflow-x-auto p-4 lg:p-6 space-y-6 bg-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
          <h1 className="lg:text-lg 4xl:text-xl text-text-dark dark:text-sidebar-accent-foreground font-medium tracking-tight">
            Recent News Letters
          </h1>
          <div className="flex justify-end">
            <RefreshButton onRefresh={load} />
          </div>
        </div>

        <Table
          data={newsletters}
          columns={columns}
          isLoading={loading}
          emptyMessage="No newsletter subscribers found"
          getRowKey={(item) => item.id}
          desktopGridClassName="md:grid-cols-[30%_15%_20%_20%_10%]"
          
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={newsletters.length}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </div>
    </div>
  );
};

export default NewsLetterPage;