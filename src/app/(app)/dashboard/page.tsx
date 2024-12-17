"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/Schemas/acceptMessageSchema";
import { APIResponse } from "@/types/APIResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-separator";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { set } from "mongoose";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };
  const {data: session} = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  });
  const {register,watch,setValue} = form;
  const acceptMessage = watch('acceptMessage')
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const d = await axios.get('/api/accept-message');
      setValue('acceptMessage',d.data.isAcceptingMessage)
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      })
    }
    finally {
      setIsSwitchLoading(false);
    }
  },[setValue])

  const fetchMessage = useCallback(async (refresh:boolean=false) => {
    setIsLoading(true);
    setIsSwitchLoading(false);
    try {
      const response = await axios.get('/api/get-messages');
      setMessages(response.data.messages);
      if(refresh){
        toast({
          title: "Refreshed Messages",
          description: "Showing latest Messages",
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      })
    }
    finally{
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  },[setIsLoading,setMessages]);

  useEffect(() => {
    if(!session || !session.user) return;
    fetchMessage();
    fetchAcceptMessage();
  },[session,setValue,fetchAcceptMessage,fetchMessage,toast]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post('/api/accept-message',{acceptMessage:!acceptMessage});
      setValue('acceptMessage',!acceptMessage);
      toast({
        title:response.data.message,
      })
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      })
      
    }
  }
  if(!session || !session.user) return <div>please login</div>;

  const {username} = session.user;
  const baseUrl = '${window.location.protocol}//${window.location.host}';
  const profileUrl = `${baseUrl}/profile/${username}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Copied to clipboard",
      description: "profile link copied to clipboard",
    })
  }
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
    <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
      <div className="flex items-center">
        <input
          type="text"
          value={profileUrl}
          disabled
          className="input input-bordered w-full p-2 mr-2"
        />
        <Button onClick={copyToClipboard}>Copy</Button>
      </div>
    </div>

    <div className="mb-4">
      <Switch
        {...register('acceptMessage')}
        checked={acceptMessage}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitchLoading}
      />
      <span className="ml-2">
        Accept Messages: {acceptMessage ? 'On' : 'Off'}
      </span>
    </div>
    <Separator />

    <Button
      className="mt-4"
      variant="outline"
      onClick={(e) => {
        e.preventDefault();
        fetchMessage(true);
      }}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCcw className="h-4 w-4" />
      )}
    </Button>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <MessageCard
            key= {message.id}
            message={message}
            onMessageDelete={handleDeleteMessage}
          />
        ))
      ) : (
        <p>No messages to display.</p>
      )}
    </div>
  </div>
  )
};

export default page;
