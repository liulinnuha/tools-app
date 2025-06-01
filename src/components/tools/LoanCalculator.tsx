// src/components/tools/LoanCalculator.tsx
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calculator as CalculatorIcon, Landmark } from "lucide-react"; // Menggunakan Landmark atau CalculatorIcon
import { useToast } from "@/components/ui/use-toast";

interface LoanResults {
    monthlyPayment: string;
    totalInterest: string;
    totalPayment: string;
}

const LoanCalculator: React.FC = () => {
    const { toast } = useToast();
    const [loanAmount, setLoanAmount] = useState<string>("");
    const [annualInterestRate, setAnnualInterestRate] = useState<string>("");
    const [loanTerm, setLoanTerm] = useState<string>("");
    const [loanTermUnit, setLoanTermUnit] = useState<"years" | "months">(
        "years",
    );
    const [results, setResults] = useState<LoanResults | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validateInputs = (): boolean => {
        if (!loanAmount || parseFloat(loanAmount) <= 0) {
            toast({
                title: "Invalid Input",
                description: "Please enter a valid loan amount.",
                variant: "destructive",
            });
            return false;
        }
        if (!annualInterestRate || parseFloat(annualInterestRate) < 0) {
            toast({
                title: "Invalid Input",
                description:
                    "Please enter a valid annual interest rate (0 or higher).",
                variant: "destructive",
            });
            return false;
        }
        if (!loanTerm || parseInt(loanTerm, 10) <= 0) {
            toast({
                title: "Invalid Input",
                description: "Please enter a valid loan term.",
                variant: "destructive",
            });
            return false;
        }
        return true;
    };

    const calculateLoan = () => {
        if (!validateInputs()) {
            setResults(null);
            return;
        }

        setIsLoading(true);
        setResults(null); // Clear previous results

        // Simulate processing delay
        setTimeout(() => {
            const principal = parseFloat(loanAmount);
            const annualRate = parseFloat(annualInterestRate) / 100;
            const monthlyRate = annualRate / 12;
            const termInYears = parseInt(loanTerm, 10);

            let numberOfPayments: number;
            if (loanTermUnit === "years") {
                numberOfPayments = termInYears * 12;
            } else {
                numberOfPayments = termInYears; // Assuming loanTerm is already in months if unit is 'months'
            }

            if (numberOfPayments <= 0) {
                toast({
                    title: "Invalid Term",
                    description:
                        "Loan term must result in positive number of payments.",
                    variant: "destructive",
                });
                setIsLoading(false);
                return;
            }

            let monthlyPaymentValue: number;
            if (monthlyRate === 0) {
                // Interest-free loan
                monthlyPaymentValue = principal / numberOfPayments;
            } else {
                monthlyPaymentValue =
                    (principal *
                        (monthlyRate *
                            Math.pow(1 + monthlyRate, numberOfPayments))) /
                    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
            }

            if (!isFinite(monthlyPaymentValue)) {
                toast({
                    title: "Calculation Error",
                    description:
                        "Could not calculate monthly payment. Check inputs.",
                    variant: "destructive",
                });
                setIsLoading(false);
                return;
            }

            const totalPaymentValue = monthlyPaymentValue * numberOfPayments;
            const totalInterestValue = totalPaymentValue - principal;

            setResults({
                monthlyPayment: monthlyPaymentValue.toFixed(2),
                totalPayment: totalPaymentValue.toFixed(2),
                totalInterest: totalInterestValue.toFixed(2),
            });
            setIsLoading(false);
        }, 500);
    };

    const clearFields = () => {
        setLoanAmount("");
        setAnnualInterestRate("");
        setLoanTerm("");
        setLoanTermUnit("years");
        setResults(null);
        setIsLoading(false);
    };

    const formatCurrency = (value: string | number) => {
        const num = Number(value);
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
            .format(num)
            .replace(/^IDR\s*/, "Rp ");
        // Ganti 'id-ID' dan 'IDR' dengan locale & currency yang sesuai jika perlu, atau buat lebih generik.
        // Untuk saat ini, kita pakai Rp sebagai contoh.
    };

    return (
        <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Loan Calculator</h2>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Landmark className="w-6 h-6 mr-2" /> Calculate Your
                        Loan
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="loanAmount">
                                Loan Amount (e.g., Rp)
                            </Label>
                            <Input
                                id="loanAmount"
                                type="number"
                                placeholder="Enter loan amount"
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(e.target.value)}
                                min="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="annualInterestRate">
                                Annual Interest Rate (%)
                            </Label>
                            <Input
                                id="annualInterestRate"
                                type="number"
                                placeholder="Enter annual interest rate (e.g., 5 for 5%)"
                                value={annualInterestRate}
                                onChange={(e) =>
                                    setAnnualInterestRate(e.target.value)
                                }
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                            <div className="space-y-2">
                                <Label htmlFor="loanTerm">Loan Term</Label>
                                <Input
                                    id="loanTerm"
                                    type="number"
                                    placeholder="Enter loan term"
                                    value={loanTerm}
                                    onChange={(e) =>
                                        setLoanTerm(e.target.value)
                                    }
                                    min="1"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="loanTermUnit">Term Unit</Label>
                                <Select
                                    value={loanTermUnit}
                                    onValueChange={(
                                        value: "years" | "months",
                                    ) => setLoanTermUnit(value)}
                                >
                                    <SelectTrigger id="loanTermUnit">
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="years">
                                            Years
                                        </SelectItem>
                                        <SelectItem value="months">
                                            Months
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button
                                className="flex-1"
                                onClick={calculateLoan}
                                disabled={isLoading}
                            >
                                <CalculatorIcon className="w-4 h-4 mr-2" />
                                {isLoading ? "Calculating..." : "Calculate"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={clearFields}
                                disabled={isLoading}
                            >
                                Clear
                            </Button>
                        </div>

                        {results && !isLoading && (
                            <div className="mt-6 p-4 bg-secondary/30 rounded-md space-y-3">
                                <h3 className="text-lg font-semibold mb-2">
                                    Loan Summary
                                </h3>
                                <div>
                                    <Label className="text-sm text-muted-foreground">
                                        Monthly Payment
                                    </Label>
                                    <div className="text-xl font-bold">
                                        {formatCurrency(results.monthlyPayment)}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">
                                        Total Interest Paid
                                    </Label>
                                    <div className="text-xl font-bold">
                                        {formatCurrency(results.totalInterest)}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">
                                        Total Payment (Principal + Interest)
                                    </Label>
                                    <div className="text-xl font-bold">
                                        {formatCurrency(results.totalPayment)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoanCalculator;
