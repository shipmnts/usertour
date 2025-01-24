"use client";

import * as React from "react";
import { Icons } from "@/components/atoms/icons";
import { Button } from "@usertour-ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@usertour-ui/dialog";
import { Input } from "@usertour-ui/input";
import { useToast } from "@usertour-ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@usertour-ui/form";
import { updateContent } from "@usertour-ui/gql";
import { useMutation } from "@apollo/client";
import { useEffect } from "react";
import { Content } from "@usertour-ui/types";
import { getErrorMessage } from "@usertour-ui/shared-utils";

interface RenameFormProps {
  data: Content;
  onSubmit: () => void;
  children: React.ReactNode;
}

const formSchema = z.object({
  name: z
    .string({
      required_error: "Please input your flow name.",
    })
    .min(1),
});

type FormValues = z.infer<typeof formSchema>;

export const ContentRenameForm = (props: RenameFormProps) => {
  const { data, children, onSubmit } = props;
  const [updateMutation] = useMutation(updateContent);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const showError = (title: string) => {
    toast({
      variant: "destructive",
      title,
    });
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: data?.name },
    mode: "onChange",
  });

  useEffect(() => {
    form.reset({ name: data?.name });
  }, [data]);

  async function handleOnSubmit(formValues: FormValues) {
    if (!data) {
      return;
    }
    setIsLoading(true);
    try {
      const variables = {
        contentId: data.id,
        content: { name: formValues.name },
      };
      await updateMutation({
        variables,
      });
    } catch (error) {
      showError(getErrorMessage(error));
    }
    setIsLoading(false);
    onSubmit();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
            <DialogHeader>
              <DialogTitle>Rename Flow </DialogTitle>
            </DialogHeader>
            <div>
              <div className="space-y-4 py-2 pb-4 pt-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Flow name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter flow name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

ContentRenameForm.displayName = "ContentRenameForm";
