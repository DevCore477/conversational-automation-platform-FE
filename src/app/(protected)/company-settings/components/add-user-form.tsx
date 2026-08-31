"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getErrorMessage } from "@/lib/get-error-message";
import { useThemeStore } from "@/store/theme.store";

const addUserSchema = z.object({
  email: z.string().email("Must be a valid email address"),
  companyRole: z.enum(["owner", "admin", "member"]),
  sendInviteEmail: z.boolean(),
});

type AddUserFormValues = z.infer<typeof addUserSchema>;

interface AddUserFormProps {
  onSubmit: (data: AddUserFormValues) => Promise<void>;
  onCancel?: () => void;
  isOwner?: boolean;
  companyId?: string;
}

export function AddUserForm({
  onSubmit,
  onCancel,
  isOwner = false,
  companyId,
}: AddUserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme, fetchTheme } = useThemeStore();

  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      email: "",
      companyRole: "member",
      sendInviteEmail: true,
    },
  });

  const handleSubmit = async (data: AddUserFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      form.reset();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to add user"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address*</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@example.com" {...field} />
              </FormControl>
              <FormDescription>
                The user will be invited to join your company
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyRole"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Role*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isOwner && (
                    <SelectItem value="owner">Owner - Full access</SelectItem>
                  )}
                  <SelectItem value="admin">
                    Admin - Can manage users and settings
                  </SelectItem>
                  <SelectItem value="member">
                    Member - Standard access
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Define the level of access for this user
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sendInviteEmail"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Send invitation email</FormLabel>
                <FormDescription>
                  User will receive an email with invitation details
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="rounded-full">
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting} 
            showWave waveColor={theme?.primaryColor}
            className="rounded-full">
            {isSubmitting ? "Adding..." : "Add User"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
