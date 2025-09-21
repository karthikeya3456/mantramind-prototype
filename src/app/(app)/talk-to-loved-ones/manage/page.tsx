'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Trash2, PlusCircle, ArrowLeft, Users, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
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
} from "@/components/ui/alert-dialog"


const lovedOneSchema = z.object({
    id: z.string(),
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    relationship: z.string().min(2, 'Relationship must be at least 2 characters.'),
    characteristics: z.string().min(20, 'Please provide at least 20 characters to describe their traits.'),
});

const formSchema = z.object({
  lovedOnes: z.array(lovedOneSchema),
});

type LovedOne = z.infer<typeof lovedOneSchema>;
type FormData = z.infer<typeof formSchema>;

export default function ManageLovedOnesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lovedOnes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lovedOnes',
  });

  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.lovedOnes) {
            reset({ lovedOnes: data.lovedOnes });
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user, reset]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (!user) {
        toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
        return;
    }
    
    // Provide immediate feedback to the user
    toast({ title: "Success", description: "Your loved ones have been saved." });
    
    // Perform the save operation in the background
    const userDocRef = doc(db, 'users', user.uid);
    setDoc(userDocRef, { lovedOnes: data.lovedOnes }, { merge: true })
        .catch((error: any) => {
            console.error("Error saving loved ones in background:", error);
            // Optionally, inform the user if the background save failed
            toast({ title: "Save Failed", description: "Your changes could not be saved in the background. Please try again.", variant: "destructive" });
        });
  };

  const addLovedOne = () => {
    append({ id: uuidv4(), name: '', relationship: '', characteristics: '' });
  };
  
  if (loading) {
      return (
          <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
      )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/talk-to-loved-ones">
                    <ArrowLeft />
                    <span className="sr-only">Back</span>
                </Link>
            </Button>
            <div>
                <h1 className="text-2xl font-bold font-headline">Manage Loved Ones</h1>
                <p className="text-muted-foreground">Add, edit, or remove profiles for the people you want to talk to.</p>
            </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            {fields.map((field, index) => (
              <Card key={field.id} className="relative">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User />
                        Profile #{index + 1}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`lovedOnes.${index}.name`}>Name</Label>
                      <Input
                        id={`lovedOnes.${index}.name`}
                        placeholder="e.g., Grandma Rose"
                        {...register(`lovedOnes.${index}.name`)}
                      />
                      {errors.lovedOnes?.[index]?.name && (
                        <p className="text-sm text-destructive">{errors.lovedOnes?.[index]?.name?.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`lovedOnes.${index}.relationship`}>Relationship</Label>
                      <Input
                        id={`lovedOnes.${index}.relationship`}
                        placeholder="e.g., Grandmother"
                        {...register(`lovedOnes.${index}.relationship`)}
                      />
                      {errors.lovedOnes?.[index]?.relationship && (
                        <p className="text-sm text-destructive">{errors.lovedOnes?.[index]?.relationship?.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`lovedOnes.${index}.characteristics`}>Characteristics & Traits</Label>
                    <Textarea
                      id={`lovedOnes.${index}.characteristics`}
                      placeholder="Describe their personality, way of speaking, common phrases, and memories..."
                      className="min-h-[100px]"
                      {...register(`lovedOnes.${index}.characteristics`)}
                    />
                    {errors.lovedOnes?.[index]?.characteristics && (
                      <p className="text-sm text-destructive">{errors.lovedOnes?.[index]?.characteristics?.message}</p>
                    )}
                  </div>
                </CardContent>
                <div className="absolute top-4 right-4">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Delete</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete this loved one's profile. This action cannot be undone.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => remove(index)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
              </Card>
            ))}
          </div>

          {fields.length === 0 && (
             <div className="text-center py-10 border-2 border-dashed rounded-lg">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">No loved ones added</h3>
                <p className="mt-1 text-sm text-muted-foreground">Click the button below to add your first one.</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Button type="button" variant="outline" onClick={addLovedOne}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Another Loved One
            </Button>
            <Button type="submit" disabled={!isDirty}>
              Save Changes
            </Button>
          </div>
        </form>
    </div>
  );
}
