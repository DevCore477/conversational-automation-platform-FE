"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { OpenAIModel } from "@/common/enums/model.types";
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
import { Textarea } from "@/components/ui/textarea";
import { VoiceSelector } from "@/components/ui/voice-selector";
import { useAuth } from "@/hooks/use-auth";
import { useVoiceStore } from "@/store/voice.store";
import { createScript } from "../actions";

const scriptSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  script: z.string().min(10, "Script must be at least 10 characters"),
  description: z.string().optional(),
  firstMessage: z.string().optional(),
  model: z.nativeEnum(OpenAIModel).default(OpenAIModel.GPT_4O_MINI).optional(),
  voiceId: z.string().optional(),
  callType: z.enum(["inbound", "outbound", "both"]),
  isActive: z.boolean().default(true).optional(),
  isDefault: z.boolean().default(false).optional(),
  companyId: z.string().optional(),
});

type ScriptFormValues = z.infer<typeof scriptSchema>;

import { type CallScript } from "@/types/script.types";

interface CreateScriptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (script: CallScript) => void;
  companyId: string | null;
}

import { getErrorMessage } from "@/lib/get-error-message";

export function CreateScriptDialog({
  open,
  onOpenChange,
  onSuccess,
  companyId,
}: CreateScriptDialogProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    voices,
    defaultVoiceId,
    fetchVoices,
    isLoading: voicesLoading,
  } = useVoiceStore();

  const form = useForm<ScriptFormValues>({
    resolver: zodResolver(scriptSchema),
    defaultValues: {
      name: "",
      script: "",
      description: "",
      firstMessage: "",
      model: OpenAIModel.GPT_4O_MINI,
      voiceId: "",
      callType: "both",
      isActive: true,
      isDefault: false,
    },
  });

  // Fetch voices on mount
  useEffect(() => {
    if (voices.length === 0 && !voicesLoading) {
      fetchVoices().catch(() => {
        // Silently fail, voices are optional
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        name: "",
        script: "",
        description: "",
        firstMessage: "",
        model: OpenAIModel.GPT_4O_MINI,
        voiceId: "",
        callType: "both",
        isActive: true,
        isDefault: false,
      });
    }
  }, [open, form]);

  const onSubmit = async (data: ScriptFormValues) => {
    setIsSubmitting(true);
    try {
      // Create FormData for Server Action
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("script", data.script);
      formData.append("callType", data.callType);
      if (data.description) formData.append("description", data.description);
      if (data.firstMessage) formData.append("firstMessage", data.firstMessage);
      formData.append("isActive", data.isActive ? "true" : "false");
      formData.append("model", data.model ?? "gpt-4");
      if (data.voiceId) formData.append("voiceId", data.voiceId);
      formData.append("isDefault", data.isDefault ? "true" : "false");
      if (companyId) formData.append("companyId", companyId);

      const result = await createScript(formData);

      if (result.success) {
        toast.success("Script created successfully");
        onOpenChange(false);
        form.reset();
        if (onSuccess && result.script) {
          onSuccess(result.script);
        }
      } else {
        toast.error(result.error || "Failed to create script");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create script"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Script</DialogTitle>
          <DialogDescription>
            Create a new call script for your conversations
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-5 gap-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Script Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Welcome Script" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="callType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Call Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select call type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="inbound">Inbound</SelectItem>
                        <SelectItem value="outbound">Outbound</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Model</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={OpenAIModel.GPT_4O_MINI}>
                          GPT-4o Mini
                        </SelectItem>
                        <SelectItem value={OpenAIModel.GPT_5_NANO}>
                          GPT-5 Nano
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="voiceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voice (Optional)</FormLabel>
                  <FormControl>
                    <VoiceSelector
                      voices={voices}
                      defaultVoiceId={defaultVoiceId}
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value === "default" ? undefined : value);
                      }}
                      disabled={voicesLoading}
                      placeholder={
                        voicesLoading
                          ? "Loading voices..."
                          : "Select a voice (optional)"
                      }
                      showDefault
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief description of this script"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Message (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Initial greeting message"
                      {...field}
                      maxLength={255}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="script"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Script Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your call script content here..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The main script content that will guide the AI conversation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Script"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
