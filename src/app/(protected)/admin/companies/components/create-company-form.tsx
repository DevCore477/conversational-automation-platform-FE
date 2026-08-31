// CreateCompanyDialog.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/get-error-message";
import { useCompanyStore } from "@/store/company.store"; // Assuming you have user authentication context

const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  description: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface CreateCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId?: string | null;
  onSuccess?: () => void;
}

export function CreateCompanyDialog({
  open,
  onOpenChange,
  companyId,
  onSuccess,
}: CreateCompanyDialogProps) {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      email: "",
      description: "",
      industry: "",
      website: "",
    },
  });

  const { createCompany, updateMyCompany, isLoading } = useCompanyStore();

  // Reset form when dialog is opened or companyId is set
  useEffect(() => {
    if (companyId) {
      form.reset({
        name: "Example Corp",
        email: "example@example.com",
        description: "A sample company",
        industry: "Tech",
        website: "https://example.com",
      });
    } else {
      form.reset({
        name: "",
        email: "",
        description: "",
        industry: "",
        website: "",
      });
    }
  }, [companyId, open, form]);

  const onSubmit = async (data: CompanyFormValues) => {
    try {
      if (companyId) {
        await updateMyCompany(data);
        toast.success("Company updated successfully");
      } else {
        await createCompany(data);
        toast.success("Company created successfully");
      }
      onOpenChange(false);
      onSuccess?.();
      form.reset();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create or update company"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {companyId ? "Edit Company" : "Create Company"}
          </DialogTitle>
          <DialogDescription>
            {companyId ? "Update your company details" : "Create a new company"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Example Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief company description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Tech" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : companyId ? "Update" : "Create"}{" "}
                Company
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
