"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
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
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/Schemas/signInSchema";

const page = () => {
  const toast = useToast();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmite = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    if (result?.error) {
      if (result?.error == "CredentialsSignin") {
        toast.toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      } else {
        toast.toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    }
    if (result?.url) {
      router.push("/dashboard");
    }
  };
  return (
    <div className="flex justify-center item-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold">Join Mystery Message</h1>
          <p className="mb-4">Login to start your annonymous feeddback</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmite)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/UserName</FormLabel>
                  <FormControl>
                    <Input placeholder="Email/username" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="bg-blue-500">
              Login
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Create an account?{" "}
            <Link href="/signup" className="text-blue-500">
              SignUp
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
