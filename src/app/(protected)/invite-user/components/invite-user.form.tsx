"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  inviteUserSchema,
  type InviteUserSchema,
} from "@/app/(protected)/invite-user/schemas/invite-user.schema";
import { UserRole } from "@/common/enums/user.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingText } from "@/components/ui/loading-text";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getErrorMessage } from "@/lib/get-error-message";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";

interface InviteUserFormProps {
  /**
   * Callback to run when invitation is sent successfully
   */
  onSuccess?: () => void;
  /**
   * If true, shows the form in compact mode (for dialogs)
   */
  compact?: boolean;
}

export function InviteUserForm({
  onSuccess,
  compact = false,
}: InviteUserFormProps) {
  const { inviteUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<InviteUserSchema>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: "",
      role: UserRole.USER,
      expiresInHours: 24,
    },
  });
  const { theme } = useThemeStore();
  const onSubmit = async (data: InviteUserSchema) => {
    setIsLoading(true);
    try {
      await inviteUser(data);
      if (!compact) {
        toast.success("Invitation sent successfully");
      }
      form.reset();
      onSuccess?.();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to send invite"));
    } finally {
      setIsLoading(false);
    }
  };

  const formContent = (
    <Form {...form}>
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: compact ? 0 : 0.3 }}
      >
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: compact ? 0.1 : 0.4 }}
            >
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="user@example.com"
                    className="w-full rounded-md focus:ring-primary focus:border-primary"
                  />
                </FormControl>
                <FormMessage className="text-red-600 mt-1" />
              </FormItem>
            </motion.div>
          )}
        />

        {/* Role Dropdown */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: compact ? 0.2 : 0.5 }}
            >
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Role">
                        {field.value
                          ? field.value.charAt(0).toUpperCase() +
                            field.value.slice(1)
                          : "Select Role"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(UserRole).map((role) => (
                        <SelectItem
                          key={role}
                          value={role}
                          className="capitalize"
                        >
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-red-600 mt-1" />
              </FormItem>
            </motion.div>
          )}
        />

        {/* Expiry Field */}
        <FormField
          control={form.control}
          name="expiresInHours"
          render={({ field }) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: compact ? 0.3 : 0.6 }}
            >
              <FormItem>
                <FormLabel>Invite Expiry (hours)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={336}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full rounded-md  focus:ring-primary focus:border-primary"
                  />
                </FormControl>
                <FormMessage className="text-red-600 mt-1" />
              </FormItem>
            </motion.div>
          )}
        />

        
        <Button
          type="submit"
          className="rounded-full float-end"
          disabled={isLoading}
          showWave
          waveColor={theme?.primaryColor}
        >
          {isLoading ? <LoadingText text="Sending invite..." /> : "Send Invite"}
        </Button>
      </motion.form>
    </Form>
  );

  // If compact mode (for dialogs), return just the form
  if (compact) {
    return formContent;
  }

  // Full page mode with headers and card
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold  ">Invite Team Member</h2>
        <p className="text-muted-foreground ">
          Fill in the details below to send an invite.
        </p>
      </motion.div>
      <motion.div
        className="max-w-3xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="rounded-2xl shadow-md ">
          <CardContent>{formContent}</CardContent>
        </Card>
      </motion.div>
    </>
  );
}
