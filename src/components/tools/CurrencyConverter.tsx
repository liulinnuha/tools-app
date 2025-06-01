// src/components/tools/CurrencyConverter.tsx
import React, { useState, useEffect } from "react";
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
import { RepeatIcon, ArrowRightLeftIcon } from "lucide-react"; // Menggunakan RepeatIcon atau ArrowRightLeftIcon
import { useToast } from "@/components/ui/use-toast";

// Data kurs mata uang tiruan (relatif terhadap USD)
// Dalam aplikasi nyata, ini akan diambil dari API
const MOCK_EXCHANGE_RATES: Record<string, { name: string; rate: number }> = {
    USD: { name: "US Dollar", rate: 1 },
    EUR: { name: "Euro", rate: 0.92 },
    GBP: { name: "British Pound", rate: 0.79 },
    JPY: { name: "Japanese Yen", rate: 157.0 },
    IDR: { name: "Indonesian Rupiah", rate: 16250.0 },
    AUD: { name: "Australian Dollar", rate: 1.5 },
    CAD: { name: "Canadian Dollar", rate: 1.37 },
    SGD: { name: "Singapore Dollar", rate: 1.35 },
    MYR: { name: "Malaysian Ringgit", rate: 4.7 },
};

const AVAILABLE_CURRENCIES = Object.keys(MOCK_EXCHANGE_RATES);

const CurrencyConverter: React.FC = () => {
    const { toast } = useToast();
    const [amount, setAmount] = useState<string>("");
    const [fromCurrency, setFromCurrency] = useState<string>("USD");
    const [toCurrency, setToCurrency] = useState<string>("IDR");
    const [result, setResult] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false); // Bisa digunakan jika fetching API

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
        setResult(""); // Kosongkan hasil jika amount berubah
    };

    const handleFromCurrencyChange = (value: string) => {
        setFromCurrency(value);
        setResult("");
    };

    const handleToCurrencyChange = (value: string) => {
        setToCurrency(value);
        setResult("");
    };

    const swapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        // Jika ada amount, bisa langsung konversi ulang atau kosongkan result
        // Untuk simpelnya, kita kosongkan result agar user menekan convert lagi
        setResult("");
    };

    const convertCurrency = () => {
        if (!amount) {
            toast({
                title: "Input Missing",
                description: "Please enter the amount to convert.",
                variant: "destructive",
            });
            return;
        }

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            toast({
                title: "Invalid Amount",
                description:
                    "Please enter a valid positive number for the amount.",
                variant: "destructive",
            });
            return;
        }

        if (!fromCurrency || !toCurrency) {
            toast({
                title: "Currency Not Selected",
                description: "Please select both 'From' and 'To' currencies.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true); // Simulasi loading

        // Simulasi pengambilan data (jika dari API)
        setTimeout(() => {
            try {
                const rateFrom = MOCK_EXCHANGE_RATES[fromCurrency]?.rate;
                const rateTo = MOCK_EXCHANGE_RATES[toCurrency]?.rate;

                if (!rateFrom || !rateTo) {
                    toast({
                        title: "Error",
                        description:
                            "Exchange rate not available for selected currencies.",
                        variant: "destructive",
                    });
                    setIsLoading(false);
                    return;
                }

                // Konversi: Amount in FromCurrency -> Amount in USD -> Amount in ToCurrency
                const amountInUSD = numericAmount / rateFrom;
                const convertedAmount = amountInUSD * rateTo;

                // Format hasil menjadi 2 desimal, kecuali untuk mata uang seperti IDR atau JPY
                let formattedResult;
                if (toCurrency === "IDR" || toCurrency === "JPY") {
                    formattedResult = convertedAmount.toFixed(0);
                } else {
                    formattedResult = convertedAmount.toFixed(2);
                }

                setResult(
                    `${numericAmount} ${fromCurrency} = ${formattedResult} ${toCurrency}`,
                );
            } catch (error) {
                toast({
                    title: "Conversion Error",
                    description:
                        "An unexpected error occurred during conversion.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        }, 500); // Simulasi delay API
    };

    const clearFields = () => {
        setAmount("");
        // Mungkin kita ingin mempertahankan pilihan currency
        // setFromCurrency('USD');
        // setToCurrency('IDR');
        setResult("");
    };

    return (
        <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Currency Converter</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Convert Currencies</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={handleAmountChange}
                                min="0"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                            <div className="space-y-2">
                                <Label htmlFor="fromCurrency">From</Label>
                                <Select
                                    value={fromCurrency}
                                    onValueChange={handleFromCurrencyChange}
                                >
                                    <SelectTrigger id="fromCurrency">
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {AVAILABLE_CURRENCIES.map(
                                            (currency) => (
                                                <SelectItem
                                                    key={currency}
                                                    value={currency}
                                                >
                                                    {currency} -{" "}
                                                    {
                                                        MOCK_EXCHANGE_RATES[
                                                            currency
                                                        ]?.name
                                                    }
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Tombol Swap hanya tampil di mobile di antara From dan To, atau di desktop di tengah */}
                            <div className="md:hidden flex justify-center py-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={swapCurrencies}
                                    aria-label="Swap currencies"
                                >
                                    <ArrowRightLeftIcon className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="toCurrency">To</Label>
                                <Select
                                    value={toCurrency}
                                    onValueChange={handleToCurrencyChange}
                                >
                                    <SelectTrigger id="toCurrency">
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {AVAILABLE_CURRENCIES.map(
                                            (currency) => (
                                                <SelectItem
                                                    key={currency}
                                                    value={currency}
                                                >
                                                    {currency} -{" "}
                                                    {
                                                        MOCK_EXCHANGE_RATES[
                                                            currency
                                                        ]?.name
                                                    }
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Tombol Swap untuk desktop, bisa diletakkan di sini atau di antara select jika layoutnya beda */}
                        <div className="hidden md:flex justify-center">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={swapCurrencies}
                                aria-label="Swap currencies"
                                className="mx-auto"
                            >
                                <ArrowRightLeftIcon className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button
                                className="flex-1"
                                onClick={convertCurrency}
                                disabled={isLoading}
                            >
                                <RepeatIcon className="w-4 h-4 mr-2" />
                                {isLoading ? "Converting..." : "Convert"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={clearFields}
                                disabled={isLoading}
                            >
                                Clear
                            </Button>
                        </div>

                        {result && !isLoading && (
                            <div className="mt-6 p-4 bg-secondary/30 rounded-md">
                                <Label>Result</Label>
                                <div className="text-xl font-bold mt-1">
                                    {result}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground mt-4 text-center">
                Exchange rates are for demonstration purposes only and may not
                be up-to-date.
            </p>
        </div>
    );
};

export default CurrencyConverter;
