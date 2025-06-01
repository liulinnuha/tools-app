// src/components/tools/InvoiceGenerator.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
    CalendarIcon,
    PlusCircle,
    Trash2,
    FileText,
    Download,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format as formatDateFns, addDays } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// Untuk ID unik, bisa gunakan library seperti uuid atau cara sederhana
// import { v4 as uuidv4 } from 'uuid';

interface LineItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface PartyDetails {
    name: string;
    address: string;
    email: string;
    phone: string;
}

const generateUniqueId = () =>
    `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const InvoiceGenerator: React.FC = () => {
    const { toast } = useToast();

    const [invoiceNumber, setInvoiceNumber] = useState<string>(
        `INV-${new Date().getFullYear()}-001`,
    );
    const [issueDate, setIssueDate] = useState<Date | undefined>(new Date());
    const [dueDate, setDueDate] = useState<Date | undefined>(
        addDays(new Date(), 30),
    );

    const initialPartyDetails: PartyDetails = {
        name: "",
        address: "",
        email: "",
        phone: "",
    };
    const [fromDetails, setFromDetails] = useState<PartyDetails>({
        ...initialPartyDetails,
        name: "Your Company Name",
    });
    const [toDetails, setToDetails] =
        useState<PartyDetails>(initialPartyDetails);

    const initialLineItem: Omit<LineItem, "id" | "total"> = {
        description: "",
        quantity: 1,
        unitPrice: 0,
    };
    const [lineItems, setLineItems] = useState<LineItem[]>([
        { ...initialLineItem, id: generateUniqueId(), total: 0 },
    ]);

    const [notes, setNotes] = useState<string>("Thank you for your business!");
    const [taxRate, setTaxRate] = useState<string>("0"); // Persentase, mis. '10' untuk 10%
    const [discountAmount, setDiscountAmount] = useState<string>("0"); // Jumlah tetap

    const [subtotal, setSubtotal] = useState<number>(0);
    const [taxValue, setTaxValue] = useState<number>(0);
    const [grandTotal, setGrandTotal] = useState<number>(0);

    const handlePartyDetailsChange = (
        party: "from" | "to",
        field: keyof PartyDetails,
        value: string,
    ) => {
        const setter = party === "from" ? setFromDetails : setToDetails;
        setter((prev) => ({ ...prev, [field]: value }));
    };

    const handleLineItemChange = (
        id: string,
        field: keyof Omit<LineItem, "id" | "total">,
        value: string | number,
    ) => {
        setLineItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === id) {
                    const newItem = {
                        ...item,
                        [field]:
                            field === "description" ? value : Number(value),
                    };
                    newItem.total = newItem.quantity * newItem.unitPrice;
                    return newItem;
                }
                return item;
            }),
        );
    };

    const addLineItem = () => {
        setLineItems((prevItems) => [
            ...prevItems,
            { ...initialLineItem, id: generateUniqueId(), total: 0 },
        ]);
    };

    const removeLineItem = (id: string) => {
        if (lineItems.length <= 1) {
            toast({
                title: "Cannot Remove",
                description: "At least one line item is required.",
                variant: "default",
            });
            return;
        }
        setLineItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const calculateTotals = useCallback(() => {
        const currentSubtotal = lineItems.reduce(
            (acc, item) => acc + item.total,
            0,
        );
        setSubtotal(currentSubtotal);

        const currentTaxRate = parseFloat(taxRate) || 0;
        const currentTaxValue = (currentSubtotal * currentTaxRate) / 100;
        setTaxValue(currentTaxValue);

        const currentDiscount = parseFloat(discountAmount) || 0;
        const currentGrandTotal =
            currentSubtotal + currentTaxValue - currentDiscount;
        setGrandTotal(currentGrandTotal);
    }, [lineItems, taxRate, discountAmount]);

    useEffect(() => {
        calculateTotals();
    }, [calculateTotals]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(amount);
        // Ganti 'id-ID' dan 'IDR' sesuai kebutuhan
    };

    // const handleGeneratePdf = () => {
    //     toast({
    //         title: "PDF Generation (Placeholder)",
    //         description:
    //             "This is where PDF generation logic would be implemented using a library like jsPDF.",
    //     });
    //     // Contoh (membutuhkan jspdf & jspdf-autotable):
    //     // const doc = new jsPDF();
    //     // doc.text("Invoice", 20, 10);
    //     // ... (tambahkan detail, tabel item, total) ...
    //     // doc.save(`invoice-${invoiceNumber}.pdf`);
    //     console.log("Invoice Data:", {
    //         invoiceNumber,
    //         issueDate,
    //         dueDate,
    //         fromDetails,
    //         toDetails,
    //         lineItems,
    //         notes,
    //         taxRate,
    //         discountAmount,
    //         subtotal,
    //         taxValue,
    //         grandTotal,
    //     });
    // };
    const handleGeneratePdf = () => {
        toast({
            title: "Generating PDF...",
            description: "Please wait a moment.",
        });

        try {
            const doc = new jsPDF(); // Orientasi default: portrait, unit: mm, format: a4

            // === 1. Judul Invoice ===
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("INVOICE", doc.internal.pageSize.getWidth() / 2, 20, {
                align: "center",
            });

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");

            // === 2. Detail Invoice (Nomor, Tanggal) ===
            let yPosition = 30;
            doc.text(`Invoice #: ${invoiceNumber}`, 14, yPosition);
            doc.text(
                `Date Issued: ${issueDate ? formatDateFns(issueDate, "PPP") : "N/A"}`,
                14,
                yPosition + 5,
            );
            doc.text(
                `Date Due: ${dueDate ? formatDateFns(dueDate, "PPP") : "N/A"}`,
                14,
                yPosition + 10,
            );

            // === 3. Detail Pengirim (From) dan Penerima (To) ===
            yPosition += 20; // Beri sedikit spasi
            const fromX = 14;
            const toX = doc.internal.pageSize.getWidth() / 2 + 10; // Kolom kanan

            doc.setFont("helvetica", "bold");
            doc.text("From:", fromX, yPosition);
            doc.setFont("helvetica", "normal");
            doc.text(fromDetails.name, fromX, yPosition + 5);
            fromDetails.address
                .split("\n")
                .forEach((line, i) =>
                    doc.text(line, fromX, yPosition + 10 + i * 5),
                );
            doc.text(
                fromDetails.email,
                fromX,
                yPosition + 10 + fromDetails.address.split("\n").length * 5 + 5,
            );
            doc.text(
                fromDetails.phone,
                fromX,
                yPosition +
                    10 +
                    fromDetails.address.split("\n").length * 5 +
                    10,
            );

            doc.setFont("helvetica", "bold");
            doc.text("To (Bill To):", toX, yPosition);
            doc.setFont("helvetica", "normal");
            doc.text(toDetails.name, toX, yPosition + 5);
            toDetails.address
                .split("\n")
                .forEach((line, i) =>
                    doc.text(line, toX, yPosition + 10 + i * 5),
                );
            doc.text(
                toDetails.email,
                toX,
                yPosition + 10 + toDetails.address.split("\n").length * 5 + 5,
            );
            doc.text(
                toDetails.phone,
                toX,
                yPosition + 10 + toDetails.address.split("\n").length * 5 + 10,
            );

            // Perkiraan yPosition setelah detail perusahaan
            yPosition +=
                10 +
                Math.max(
                    fromDetails.address.split("\n").length,
                    toDetails.address.split("\n").length,
                ) *
                    5 +
                15;

            // === 4. Tabel Item Baris ===
            const tableColumn = ["Description", "Qty", "Unit Price", "Total"];
            const tableRows: (string | number)[][] = [];

            lineItems.forEach((item) => {
                const itemData = [
                    item.description,
                    item.quantity.toString(),
                    formatCurrency(item.unitPrice),
                    formatCurrency(item.total),
                ];
                tableRows.push(itemData);
            });

            // Panggil autoTable sebagai fungsi, passing doc sebagai argumen pertama
            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: yPosition + 5,
                theme: "striped",
                headStyles: { fillColor: [22, 160, 133] },
                didDrawPage: (data: any) => {
                    // Footer halaman jika ada
                },
            });

            // Dapatkan posisi y setelah tabel
            // Properti lastAutoTable seharusnya tetap ada di instance doc setelah autoTable(doc, ...) dipanggil
            yPosition = (doc as any).lastAutoTable.finalY + 10;

            // === 5. Summary (Subtotal, Pajak, Diskon, Grand Total) ===
            const summaryX = doc.internal.pageSize.getWidth() - 70; // Align ke kanan
            const valueX = doc.internal.pageSize.getWidth() - 14; // Align nilai ke paling kanan

            doc.setFontSize(10);
            doc.text("Subtotal:", summaryX, yPosition, { align: "left" });
            doc.text(formatCurrency(subtotal), valueX, yPosition, {
                align: "right",
            });
            yPosition += 7;

            if (parseFloat(taxRate) > 0) {
                doc.text(`Tax (${taxRate}%):`, summaryX, yPosition, {
                    align: "left",
                });
                doc.text(formatCurrency(taxValue), valueX, yPosition, {
                    align: "right",
                });
                yPosition += 7;
            }

            if (parseFloat(discountAmount) > 0) {
                doc.text("Discount:", summaryX, yPosition, { align: "left" });
                doc.text(
                    `-${formatCurrency(parseFloat(discountAmount))}`,
                    valueX,
                    yPosition,
                    { align: "right" },
                );
                yPosition += 7;
            }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text("Grand Total:", summaryX, yPosition, { align: "left" });
            doc.text(formatCurrency(grandTotal), valueX, yPosition, {
                align: "right",
            });
            yPosition += 10;

            // === 6. Notes / Terms ===
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text("Notes / Terms:", 14, yPosition);
            yPosition += 5;
            const splitNotes = doc.splitTextToSize(
                notes,
                doc.internal.pageSize.getWidth() - 28,
            ); // Lebar - margin
            doc.text(splitNotes, 14, yPosition);

            // === 7. Simpan atau Buka PDF ===
            // doc.save(`invoice-${invoiceNumber || 'draft'}.pdf`); // Untuk langsung download
            doc.output("pdfobjectnewwindow"); // Untuk membuka di tab/window baru sebagai preview

            toast({
                title: "PDF Generated Successfully!",
                description: "Invoice opened in a new window.",
                variant: "success",
            });
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast({
                title: "PDF Generation Failed",
                description: "An error occurred while generating the PDF.",
                variant: "destructive",
            });
        }
    };

    const resetForm = () => {
        setInvoiceNumber(`INV-${new Date().getFullYear()}-001`);
        setIssueDate(new Date());
        setDueDate(addDays(new Date(), 30));
        setFromDetails({ ...initialPartyDetails, name: "Your Company Name" });
        setToDetails(initialPartyDetails);
        setLineItems([
            { ...initialLineItem, id: generateUniqueId(), total: 0 },
        ]);
        setNotes("Thank you for your business!");
        setTaxRate("0");
        setDiscountAmount("0");
        // total akan dihitung ulang oleh useEffect
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold flex items-center">
                    <FileText className="w-8 h-8 mr-2" /> Invoice Generator
                </h2>
                <Button onClick={resetForm} variant="outline">
                    Reset Form
                </Button>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Invoice Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="invoiceNumber">Invoice Number</Label>
                        <Input
                            id="invoiceNumber"
                            value={invoiceNumber}
                            onChange={(e) => setInvoiceNumber(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="issueDate">Issue Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {issueDate ? (
                                        formatDateFns(issueDate, "PPP")
                                    ) : (
                                        <span>Pick issue date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={issueDate}
                                    onSelect={setIssueDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dueDate ? (
                                        formatDateFns(dueDate, "PPP")
                                    ) : (
                                        <span>Pick due date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={dueDate}
                                    onSelect={setDueDate}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>From</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <Label htmlFor="fromName">Name</Label>
                            <Input
                                id="fromName"
                                value={fromDetails.name}
                                onChange={(e) =>
                                    handlePartyDetailsChange(
                                        "from",
                                        "name",
                                        e.target.value,
                                    )
                                }
                                placeholder="Your Company Name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="fromAddress">Address</Label>
                            <Textarea
                                id="fromAddress"
                                value={fromDetails.address}
                                onChange={(e) =>
                                    handlePartyDetailsChange(
                                        "from",
                                        "address",
                                        e.target.value,
                                    )
                                }
                                placeholder="Your Company Address"
                            />
                        </div>
                        <div>
                            <Label htmlFor="fromEmail">Email</Label>
                            <Input
                                id="fromEmail"
                                type="email"
                                value={fromDetails.email}
                                onChange={(e) =>
                                    handlePartyDetailsChange(
                                        "from",
                                        "email",
                                        e.target.value,
                                    )
                                }
                                placeholder="your.email@example.com"
                            />
                        </div>
                        <div>
                            <Label htmlFor="fromPhone">Phone</Label>
                            <Input
                                id="fromPhone"
                                type="tel"
                                value={fromDetails.phone}
                                onChange={(e) =>
                                    handlePartyDetailsChange(
                                        "from",
                                        "phone",
                                        e.target.value,
                                    )
                                }
                                placeholder="+1234567890"
                            />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>To (Bill To)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <Label htmlFor="toName">Name</Label>
                            <Input
                                id="toName"
                                value={toDetails.name}
                                onChange={(e) =>
                                    handlePartyDetailsChange(
                                        "to",
                                        "name",
                                        e.target.value,
                                    )
                                }
                                placeholder="Client Company Name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="toAddress">Address</Label>
                            <Textarea
                                id="toAddress"
                                value={toDetails.address}
                                onChange={(e) =>
                                    handlePartyDetailsChange(
                                        "to",
                                        "address",
                                        e.target.value,
                                    )
                                }
                                placeholder="Client Company Address"
                            />
                        </div>
                        <div>
                            <Label htmlFor="toEmail">Email</Label>
                            <Input
                                id="toEmail"
                                type="email"
                                value={toDetails.email}
                                onChange={(e) =>
                                    handlePartyDetailsChange(
                                        "to",
                                        "email",
                                        e.target.value,
                                    )
                                }
                                placeholder="client.email@example.com"
                            />
                        </div>
                        <div>
                            <Label htmlFor="toPhone">Phone</Label>
                            <Input
                                id="toPhone"
                                type="tel"
                                value={toDetails.phone}
                                onChange={(e) =>
                                    handlePartyDetailsChange(
                                        "to",
                                        "phone",
                                        e.target.value,
                                    )
                                }
                                placeholder="+0987654321"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Line Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-2">
                                        Description
                                    </th>
                                    <th className="text-right p-2 w-24">Qty</th>
                                    <th className="text-right p-2 w-32">
                                        Unit Price
                                    </th>
                                    <th className="text-right p-2 w-32">
                                        Total
                                    </th>
                                    <th className="text-center p-2 w-16">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {lineItems.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className="border-b last:border-b-0 hover:bg-muted/50"
                                    >
                                        <td className="p-1">
                                            <Input
                                                type="text"
                                                value={item.description}
                                                onChange={(e) =>
                                                    handleLineItemChange(
                                                        item.id,
                                                        "description",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Item description"
                                                className="w-full"
                                            />
                                        </td>
                                        <td className="p-1">
                                            <Input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleLineItemChange(
                                                        item.id,
                                                        "quantity",
                                                        e.target.value,
                                                    )
                                                }
                                                min="1"
                                                className="w-full text-right"
                                            />
                                        </td>
                                        <td className="p-1">
                                            <Input
                                                type="number"
                                                value={item.unitPrice}
                                                onChange={(e) =>
                                                    handleLineItemChange(
                                                        item.id,
                                                        "unitPrice",
                                                        e.target.value,
                                                    )
                                                }
                                                min="0"
                                                step="0.01"
                                                className="w-full text-right"
                                            />
                                        </td>
                                        <td className="p-1 text-right whitespace-nowrap">
                                            {formatCurrency(item.total)}
                                        </td>
                                        <td className="p-1 text-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    removeLineItem(item.id)
                                                }
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Button
                        onClick={addLineItem}
                        variant="outline"
                        className="mt-4"
                    >
                        <PlusCircle className="w-4 h-4 mr-2" /> Add Item
                    </Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Notes / Terms</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Enter notes or payment terms here..."
                            rows={4}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label>Subtotal</Label>
                            <span className="font-semibold">
                                {formatCurrency(subtotal)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <Label htmlFor="taxRate">Tax Rate (%)</Label>
                            <Input
                                id="taxRate"
                                type="number"
                                value={taxRate}
                                onChange={(e) => setTaxRate(e.target.value)}
                                min="0"
                                className="w-20 text-right"
                                placeholder="e.g. 10"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <Label>Tax Amount</Label>
                            <span className="font-semibold">
                                {formatCurrency(taxValue)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <Label htmlFor="discountAmount">
                                Discount Amount
                            </Label>
                            <Input
                                id="discountAmount"
                                type="number"
                                value={discountAmount}
                                onChange={(e) =>
                                    setDiscountAmount(e.target.value)
                                }
                                min="0"
                                className="w-28 text-right"
                                placeholder="e.g. 50000"
                            />
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between items-center text-xl font-bold">
                            <Label>Grand Total</Label>
                            <span>{formatCurrency(grandTotal)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <CardFooter className="flex justify-end p-0 pt-6">
                <Button onClick={handleGeneratePdf} size="lg">
                    <Download className="w-5 h-5 mr-2" /> Preview / Download PDF
                    (Placeholder)
                </Button>
            </CardFooter>
        </div>
    );
};

export default InvoiceGenerator;
