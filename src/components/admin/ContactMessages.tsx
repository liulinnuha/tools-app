import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MessageSquare, Reply } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  replied: boolean;
  reply_text: string | null;
  created_at: string;
};

interface ContactMessagesProps {
  messages: ContactMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ContactMessage[]>>;
  openReplyDialog: (message: ContactMessage) => void;
  refreshMessages: () => void;
  isLoading: boolean;
}

const ContactMessages: React.FC<ContactMessagesProps> = ({
  messages,
  openReplyDialog,
  refreshMessages,
  isLoading
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-primary" />
          Contact Messages
        </h3>
        <Button variant="outline" onClick={refreshMessages} disabled={isLoading}>
          {isLoading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No messages found
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>{message.subject}</TableCell>
                    <TableCell>{new Date(message.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {message.replied ?
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          Replied
                        </span> :
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                          Pending
                        </span>
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openReplyDialog(message)}
                      >
                        <Reply className="h-4 w-4 mr-2" />
                        {message.replied ? "View Reply" : "Reply"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;
