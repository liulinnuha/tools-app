import React, { useState } from "react";
import {
    LifeBuoy,
    Mail,
    Phone,
    MessageCircle,
    FileQuestion,
    ChevronDown,
    Search,
    Send,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const SupportPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("faq");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const [contactForm, setContactForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setContactForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Send data to Supabase
            const { error } = await supabase
                .from("contact_messages")
                .insert([contactForm]);

            if (error) throw error;

            toast({
                title: "Message Sent Successfully!",
                description:
                    "Thank you for your message. We will get back to you soon!",
            });

            // Reset form
            setContactForm({
                name: "",
                email: "",
                subject: "",
                message: "",
            });
        } catch (error) {
            console.error("Error submitting contact form:", error);
            toast({
                title: "Submission Failed",
                description:
                    "There was a problem sending your message. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const faqCategories = [
        {
            title: "General Questions",
            items: [
                {
                    question: "What is ToolHub?",
                    answer: "ToolHub is a comprehensive collection of online tools designed to help users with various digital tasks. From file conversion to data calculation, our platform offers a wide range of utilities that are free to use directly in your browser.",
                },
                {
                    question: "Are these tools free to use?",
                    answer: "Yes, all the tools available on ToolHub are completely free to use. We believe in providing accessible utilities to everyone without any hidden costs.",
                },
                {
                    question: "Do I need to create an account?",
                    answer: "No, you don't need to create an account to use our tools. However, creating an account allows you to save your preferences and access your history.",
                },
            ],
        },
        {
            title: "Technical Support",
            items: [
                {
                    question:
                        "A tool is not working properly. What should I do?",
                    answer: "First, try refreshing the page or clearing your browser cache. If the issue persists, please report it through our contact form with details about the problem and which browser you're using.",
                },
                {
                    question: "Is my data safe when using these tools?",
                    answer: "We take data privacy seriously. All processing happens in your browser, and we don't store your uploaded files or processed data on our servers unless explicitly stated otherwise for a specific tool.",
                },
                {
                    question: "Can I use these tools on mobile devices?",
                    answer: "Yes, all our tools are designed to be responsive and work well on mobile devices. However, some complex tools might provide a better experience on desktop for larger files or detailed operations.",
                },
            ],
        },
        {
            title: "Business Inquiries",
            items: [
                {
                    question: "Can I suggest a new tool?",
                    answer: 'Absolutely! We love hearing from our users about what tools would be useful. Please use the "Suggest Tool" feature in the navigation menu to submit your ideas.',
                },
                {
                    question: "Do you offer API access to these tools?",
                    answer: "Currently, we don't offer public API access to our tools. However, if you have a business need for API integration, please contact us to discuss potential partnership opportunities.",
                },
                {
                    question: "Are there any usage limits?",
                    answer: "Our tools are designed for individual use. While there are no strict limits, we monitor usage patterns to prevent abuse and ensure fair access for all users.",
                },
            ],
        },
    ];

    const contactMethods = [
        {
            icon: Mail,
            title: "Email Support",
            description: "Send us an email and we'll respond within 24 hours.",
            action: "support@toolhub.com",
            color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
        },
        {
            icon: Phone,
            title: "Phone Support",
            description: "Available Monday to Friday, 9AM to 5PM EST.",
            action: "+1 (555) 123-4567",
            color: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
        },
        {
            icon: MessageCircle,
            title: "Live Chat",
            description: "Chat with our support team in real-time.",
            action: "Start Chat",
            color: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow pt-24 pb-16">
                {/* Hero Section */}
                <section className="bg-gradient-to-b from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 py-12 mb-8">
                    <div className="container mx-auto px-4 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                            <LifeBuoy className="w-10 h-10 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                            How Can We Help You?
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                            Find answers, get support, or contact our team.
                            We're here to ensure you have the best experience
                            with our tools.
                        </p>

                        <div className="max-w-xl mx-auto relative">
                            <Input
                                type="text"
                                placeholder="Search for answers..."
                                className="pl-10 pr-4 py-6 text-lg rounded-full shadow-lg"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full">
                                Search
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Tab Navigation */}
                <section className="container mx-auto px-4 mb-8">
                    <div className="flex flex-wrap gap-2 justify-center mb-8">
                        <Button
                            variant={
                                activeTab === "faq" ? "default" : "outline"
                            }
                            className="rounded-full text-lg py-6 px-8"
                            onClick={() => setActiveTab("faq")}
                        >
                            <FileQuestion className="w-5 h-5 mr-2" />
                            FAQs
                        </Button>
                        <Button
                            variant={
                                activeTab === "contact" ? "default" : "outline"
                            }
                            className="rounded-full text-lg py-6 px-8"
                            onClick={() => setActiveTab("contact")}
                        >
                            <Mail className="w-5 h-5 mr-2" />
                            Contact Us
                        </Button>
                        <Button
                            variant={
                                activeTab === "help" ? "default" : "outline"
                            }
                            className="rounded-full text-lg py-6 px-8"
                            onClick={() => setActiveTab("help")}
                        >
                            <LifeBuoy className="w-5 h-5 mr-2" />
                            Help Center
                        </Button>
                    </div>

                    {/* FAQ Section */}
                    <div
                        className={cn(
                            "transition-all duration-300",
                            activeTab === "faq" ? "block" : "hidden",
                        )}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            {faqCategories.map((category, index) => (
                                <div
                                    key={index}
                                    className="bg-card rounded-2xl shadow-md overflow-hidden border border-border"
                                >
                                    <div className="bg-primary/5 p-5 border-b border-border">
                                        <h3 className="font-semibold text-xl text-primary">
                                            {category.title}
                                        </h3>
                                    </div>
                                    <div className="p-4">
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="w-full space-y-2"
                                        >
                                            {category.items.map(
                                                (item, itemIndex) => (
                                                    <AccordionItem
                                                        key={itemIndex}
                                                        value={`${index}-${itemIndex}`}
                                                    >
                                                        <AccordionTrigger className="px-5 py-4 text-lg font-medium hover:bg-primary/10 transition-all rounded-lg">
                                                            {item.question}
                                                        </AccordionTrigger>
                                                        <AccordionContent className="px-5 py-3 text-muted-foreground text-base leading-relaxed">
                                                            {item.answer}
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ),
                                            )}
                                        </Accordion>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Us Section */}
                    <div
                        className={cn(
                            "transition-all duration-300",
                            activeTab === "contact" ? "block" : "hidden",
                        )}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 space-y-6">
                                <h2 className="text-3xl font-bold mb-4">
                                    Get in Touch
                                </h2>
                                <p className="text-xl text-muted-foreground mb-6">
                                    We'd love to hear from you. Please fill out
                                    the form or use one of our contact methods.
                                </p>

                                <div className="space-y-4">
                                    {contactMethods.map((method, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center p-4 rounded-lg border border-border bg-card"
                                        >
                                            <div
                                                className={cn(
                                                    "p-3 rounded-full mr-4",
                                                    method.color,
                                                )}
                                            >
                                                <method.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-lg">
                                                    {method.title}
                                                </h4>
                                                <p className="text-muted-foreground">
                                                    {method.description}
                                                </p>
                                                <p className="font-medium mt-1">
                                                    {method.action}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                                    <h3 className="text-2xl font-semibold mb-4">
                                        Send Us a Message
                                    </h3>
                                    <form onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="name"
                                                    className="text-lg font-medium"
                                                >
                                                    Your Name
                                                </label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    placeholder="John Doe"
                                                    value={contactForm.name}
                                                    onChange={handleFormChange}
                                                    required
                                                    className="py-6 text-base"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="email"
                                                    className="text-lg font-medium"
                                                >
                                                    Email Address
                                                </label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    value={contactForm.email}
                                                    onChange={handleFormChange}
                                                    required
                                                    className="py-6 text-base"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <label
                                                htmlFor="subject"
                                                className="text-lg font-medium"
                                            >
                                                Subject
                                            </label>
                                            <Input
                                                id="subject"
                                                name="subject"
                                                placeholder="How can we help you?"
                                                value={contactForm.subject}
                                                onChange={handleFormChange}
                                                required
                                                className="py-6 text-base"
                                            />
                                        </div>

                                        <div className="space-y-2 mb-6">
                                            <label
                                                htmlFor="message"
                                                className="text-lg font-medium"
                                            >
                                                Message
                                            </label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                placeholder="Please describe your question or issue in detail..."
                                                rows={5}
                                                value={contactForm.message}
                                                onChange={handleFormChange}
                                                required
                                                className="resize-none text-base"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full md:w-auto py-6 px-8 text-lg"
                                            disabled={isSubmitting}
                                        >
                                            <Send className="w-5 h-5 mr-2" />
                                            {isSubmitting
                                                ? "Sending..."
                                                : "Send Message"}
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Help Center Section */}
                    <div
                        className={cn(
                            "transition-all duration-300",
                            activeTab === "help" ? "block" : "hidden",
                        )}
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold mb-3">
                                Help Center
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Browse our comprehensive guides and tutorials to
                                learn how to make the most of our tools.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="h-40 bg-gradient-to-r from-primary/20 to-primary/5 flex items-center justify-center">
                                        <div className="bg-primary/10 p-4 rounded-full">
                                            <LifeBuoy className="w-8 h-8 text-primary" />
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-semibold text-lg mb-2">
                                            {
                                                [
                                                    "Getting Started Guide",
                                                    "PDF Tools Tutorial",
                                                    "Data Conversion Tips",
                                                    "Image Processing Guide",
                                                    "Text Manipulation Tools",
                                                    "Advanced Features",
                                                ][index]
                                            }
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            Learn how to efficiently use our
                                            tools with step-by-step instructions
                                            and examples.
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Read Guide
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default SupportPage;
