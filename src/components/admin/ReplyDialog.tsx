import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail } from 'lucide-react';

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

interface ReplyDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  replyingTo: ContactMessage | null;
  replyMessage: string;
  setReplyMessage: React.Dispatch<React.SetStateAction<string>>;
  sendReply: () => void;
}

const ReplyDialog: React.FC<ReplyDialogProps> = ({
  isOpen,
  setIsOpen,
  replyingTo,
  replyMessage,
  setReplyMessage,
  sendReply
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Reply to Message</DialogTitle>
          <DialogDescription>
            Send a reply to {replyingTo?.name}
          </DialogDescription>
        </DialogHeader>

        {replyingTo && (
          <div className="space-y-4 py-4">
            <div className="bg-muted p-4 rounded-md">
              <div className="mb-2">
                <span className="font-semibold">From:</span> {replyingTo.name} ({replyingTo.email})
              </div>
              <div className="mb-2">
                <span className="font-semibold">Subject:</span> {replyingTo.subject}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Message:</span>
              </div>
              <div className="pl-2 border-l-2 border-primary/20">
                {replyingTo.message}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reply" className="text-lg font-medium">
                Your Reply
              </Label>
              <Textarea
                id="reply"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Write your reply here..."
                className="min-h-[150px]"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={sendReply} disabled={!replyMessage.trim()}>
            <Mail className="h-4 w-4 mr-2" />
            Send Reply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyDialog;
