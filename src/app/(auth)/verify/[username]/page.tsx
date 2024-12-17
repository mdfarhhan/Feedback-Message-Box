'use client'
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { verifySchema } from "@/Schemas/verifySchema";
import { APIResponse } from "@/types/APIResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const verifyAccount = () => {
  const router = useRouter();
  const param = useParams();
  const toast = useToast();
  const form = useForm({
    resolver: zodResolver(verifySchema),
  });
  const subm = async(data:z.infer<typeof verifySchema>)=>{
    try {
        const response = await axios.post("/api/verify-code",{
            username: param.username,
            verifyCode: data.verifyCode
        });
        toast.toast({
            title: "Success",
            description: response.data.message
        })
        router.replace("/login");
    } catch (error) {
        console.error("Error signing up", error);
              const axiosError = error as AxiosError<APIResponse>;
              let errorMessage =axiosError.response?.data.message ?? "Error signing up";
              toast.toast({
                title: "SIGN UP ERROR",
                description: errorMessage,
                variant: "destructive",
              });
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y=8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                    Verify your Account
                </h1>
                <p className="mb-4">
                    Enter the verification code sent to your email.
                </p>
            </div>
            <Form {...form}>
      <form onSubmit={form.handleSubmit(subm)} className="space-y-6">
        <FormField
          control={form.control}
          name="verifyCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="code" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
        </div>
    </div>
  )
};

export default verifyAccount;
