'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteAlbumAction } from "@/lib/actions";
import { Trash } from "lucide-react";
import { useFormStatus } from "react-dom";

function DeleteFormButton() {
    const { pending } = useFormStatus();
    return (
        <AlertDialogAction
            type="submit"
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={pending}
        >
            {pending ? 'Deleting...' : 'Delete'}
        </AlertDialogAction>
    );
}

export default function DeleteAlbumButton({ id }: { id: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash className="mr-2 h-4 w-4" /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the album
            from the records.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <form action={deleteAlbumAction} className="flex items-center gap-2">
            <input type="hidden" name="id" value={id} />
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <DeleteFormButton />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
