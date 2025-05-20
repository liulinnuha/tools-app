import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAdmin } from '@/hooks/useAdmin';
import { tools, ToolType } from '@/data/tools';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  ArrowLeft, ShieldCheck, ListChecks, Grid3X3,
  MessageSquare, Lightbulb
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Import refactored components
import LoginForm from '@/components/admin/LoginForm';
import ToolsManagement from '@/components/admin/ToolsManagement';
import CategoriesManagement from '@/components/admin/CategoriesManagement';
import ContactMessages from '@/components/admin/ContactMessages';
import ToolSuggestions from '@/components/admin/ToolSuggestions';
import EditToolDialog from '@/components/admin/EditToolDialog';
import ReplyDialog from '@/components/admin/ReplyDialog';
import ReviewDialog from '@/components/admin/ReviewDialog';

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

type ToolSuggestion = {
  id: string;
  name: string;
  description: string;
  category: string;
  link: string | null;
  email: string;
  reviewed: boolean;
  approved: boolean;
  created_at: string;
};

const AdminPanel: React.FC = () => {
  const { isAdmin, login, logout } = useAdmin();
  const [toolsList, setToolsList] = useState<ToolType[]>([...tools]);
  const [editingTool, setEditingTool] = useState<ToolType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // State for contact messages and tool suggestions
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [toolSuggestions, setToolSuggestions] = useState<ToolSuggestion[]>([]);
  const [replyingTo, setReplyingTo] = useState<ContactMessage | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewingTool, setReviewingTool] = useState<ToolSuggestion | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  // Fetch messages and suggestions when admin is logged in
  useEffect(() => {
    if (isAdmin) {
      fetchContactMessages();
      fetchToolSuggestions();
    }
  }, [isAdmin]);

  // Fetch contact messages
  const fetchContactMessages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setContactMessages(data || []);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      toast({
        title: "Error",
        description: "Failed to load contact messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tool suggestions
  const fetchToolSuggestions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tool_suggestions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setToolSuggestions(data || []);
    } catch (error) {
      console.error('Error fetching tool suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to load tool suggestions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update tool
  const updateTool = (updatedTool: ToolType) => {
    setToolsList(prev =>
      prev.map(tool => tool.id === updatedTool.id ? updatedTool : tool)
    );
    setIsEditDialogOpen(false);
    setEditingTool(null);

    toast({
      title: "Tool updated",
      description: `${updatedTool.name} has been updated successfully.`,
      variant: "default",
    });
  };

  // Open reply dialog
  const openReplyDialog = (message: ContactMessage) => {
    setReplyingTo(message);
    setReplyMessage(message.reply_text || '');
    setIsReplyDialogOpen(true);
  };

  // Send reply to contact message
  const sendReply = async () => {
    if (!replyingTo) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({
          replied: true,
          reply_text: replyMessage
        })
        .eq('id', replyingTo.id);

      if (error) throw error;

      // Update the local state
      setContactMessages(messages =>
        messages.map(msg =>
          msg.id === replyingTo.id
            ? { ...msg, replied: true, reply_text: replyMessage }
            : msg
        )
      );

      setIsReplyDialogOpen(false);
      setReplyingTo(null);
      setReplyMessage('');

      toast({
        title: "Reply Sent",
        description: "Your reply has been sent successfully.",
      });

      // In a real app, you would send an email here
      console.log(`Sending email to ${replyingTo.email} with reply: ${replyMessage}`);

    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    }
  };

  // Open review dialog for tool suggestion
  const openReviewDialog = (suggestion: ToolSuggestion) => {
    setReviewingTool(suggestion);
    setIsReviewDialogOpen(true);
  };

  // Review tool suggestion
  const reviewToolSuggestion = async (approved: boolean) => {
    if (!reviewingTool) return;

    try {
      const { error } = await supabase
        .from('tool_suggestions')
        .update({
          reviewed: true,
          approved
        })
        .eq('id', reviewingTool.id);

      if (error) throw error;

      // Update the local state
      setToolSuggestions(suggestions =>
        suggestions.map(suggestion =>
          suggestion.id === reviewingTool.id
            ? { ...suggestion, reviewed: true, approved }
            : suggestion
        )
      );

      setIsReviewDialogOpen(false);
      setReviewingTool(null);

      toast({
        title: approved ? "Suggestion Approved" : "Suggestion Rejected",
        description: `The tool suggestion has been ${approved ? 'approved' : 'rejected'}.`,
      });

      // In a real app, you would send an email to the user here
      console.log(`Sending email to ${reviewingTool.email} about their suggestion status: ${approved ? 'Approved' : 'Rejected'}`);

    } catch (error) {
      console.error('Error reviewing tool suggestion:', error);
      toast({
        title: "Error",
        description: "Failed to update suggestion status",
        variant: "destructive",
      });
    }
  };

  // Edit tool dialog
  const openEditDialog = (tool: ToolType) => {
    setEditingTool({...tool});
    setIsEditDialogOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-16 pb-10 container mx-auto px-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">Admin Panel</h1>
        </div>

        {!isAdmin ? (
          <LoginForm login={login} />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold flex items-center">
                  <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
                  Admin Dashboard
                </h2>
                <p className="text-sm text-muted-foreground">
                  Manage tools, messages, and application settings
                </p>
              </div>
              <Button variant="destructive" onClick={logout}>Logout</Button>
            </div>

            <Tabs defaultValue="tools" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="tools">
                  <ListChecks className="h-4 w-4 mr-2" />
                  Manage Tools
                </TabsTrigger>
                <TabsTrigger value="categories">
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Categories
                </TabsTrigger>
                <TabsTrigger value="messages">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                </TabsTrigger>
                <TabsTrigger value="suggestions">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Tool Suggestions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tools" className="space-y-4">
                <ToolsManagement
                  toolsList={toolsList}
                  setToolsList={setToolsList}
                  openEditDialog={openEditDialog}
                />
              </TabsContent>

              <TabsContent value="categories" className="space-y-4">
                <CategoriesManagement />
              </TabsContent>

              <TabsContent value="messages" className="space-y-4">
                <ContactMessages
                  messages={contactMessages}
                  setMessages={setContactMessages}
                  openReplyDialog={openReplyDialog}
                  refreshMessages={fetchContactMessages}
                  isLoading={isLoading}
                />
              </TabsContent>

              <TabsContent value="suggestions" className="space-y-4">
                <ToolSuggestions
                  suggestions={toolSuggestions}
                  openReviewDialog={openReviewDialog}
                  refreshSuggestions={fetchToolSuggestions}
                  isLoading={isLoading}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      {/* Dialogs */}
      <EditToolDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        editingTool={editingTool}
        setEditingTool={setEditingTool}
        updateTool={updateTool}
      />

      <ReplyDialog
        isOpen={isReplyDialogOpen}
        setIsOpen={setIsReplyDialogOpen}
        replyingTo={replyingTo}
        replyMessage={replyMessage}
        setReplyMessage={setReplyMessage}
        sendReply={sendReply}
      />

      <ReviewDialog
        isOpen={isReviewDialogOpen}
        setIsOpen={setIsReviewDialogOpen}
        reviewingTool={reviewingTool}
        reviewToolSuggestion={reviewToolSuggestion}
      />

      <Footer />
    </div>
  );
};

export default AdminPanel;
