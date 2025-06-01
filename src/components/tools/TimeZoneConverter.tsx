// src/components/tools/TimeZoneConverter.tsx
import React, { useState, useEffect, useCallback } from "react";
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Clock, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
    format as formatDateFns,
    isValid,
    getYear,
    getMonth,
    getDate,
} from "date-fns";
import {
    toZonedTime, // Diganti dari utcToZonedTime
    fromZonedTime, // Diganti dari zonedTimeToUtc
    format, // format dari date-fns-tz, alias formatInTimeZone jika ada konflik
} from "date-fns-tz";

const COMMON_TIMEZONES = [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Asia/Jakarta",
    "Australia/Sydney",
    "Pacific/Auckland",
];

const getLocalTimeZone = (): string => {
    try {
        const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return COMMON_TIMEZONES.includes(localTz) ? localTz : "UTC";
    } catch (e) {
        return "UTC"; // Fallback jika Intl API tidak tersedia atau gagal
    }
};

const TimeZoneConverter: React.FC = () => {
    const { toast } = useToast();

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date(),
    );
    const [selectedTime, setSelectedTime] = useState<string>(
        formatDateFns(new Date(), "HH:mm"),
    );
    const [fromZone, setFromZone] = useState<string>(getLocalTimeZone());
    const [toZone, setToZone] = useState<string>("UTC");
    const [convertedDateTime, setConvertedDateTime] = useState<string | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const performConversion = useCallback(() => {
        if (!selectedDate || !selectedTime || !fromZone || !toZone) {
            setConvertedDateTime(null);
            return;
        }

        setIsLoading(true);

        try {
            const [hoursStr, minutesStr] = selectedTime.split(":");
            const hours = parseInt(hoursStr, 10);
            const minutes = parseInt(minutesStr, 10);

            if (
                isNaN(hours) ||
                isNaN(minutes) ||
                hours < 0 ||
                hours > 23 ||
                minutes < 0 ||
                minutes > 59
            ) {
                toast({
                    title: "Invalid Time",
                    description: "Please enter a valid time (HH:MM).",
                    variant: "destructive",
                });
                setConvertedDateTime(null);
                setIsLoading(false);
                return;
            }

            const year = getYear(selectedDate);
            const month = getMonth(selectedDate) + 1;
            const day = getDate(selectedDate);

            // String ini merepresentasikan "wall clock time" di `fromZone`
            const dateTimeStringInFromZone = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;

            // 1. Konversi "wall clock time" di `fromZone` ke UTC Date object
            //    fromZonedTime mengambil string tanggal/waktu dan zona waktu asalnya,
            //    dan mengembalikan objek Date JavaScript standar (yang merupakan timestamp UTC).
            const utcDate = fromZonedTime(dateTimeStringInFromZone, fromZone);

            if (!isValid(utcDate)) {
                toast({
                    title: "Invalid Source Date/Time",
                    description:
                        "The selected date or time for the source zone is invalid.",
                    variant: "destructive",
                });
                setConvertedDateTime(null);
                setIsLoading(false);
                return;
            }

            // 2. Format objek Date UTC ini untuk ditampilkan seolah-olah berada di `toZone`.
            //    Fungsi `format` dari `date-fns-tz` dapat mengambil objek Date (yang UTC)
            //    dan memformatnya menggunakan `timeZone` dari options.
            const formattedResult = format(
                utcDate,
                "MMM d, yyyy, HH:mm:ss (zzz)",
                { timeZone: toZone },
            );
            setConvertedDateTime(formattedResult);
        } catch (error: any) {
            console.error("Time conversion error:", error);
            toast({
                title: "Conversion Error",
                description:
                    error.message ||
                    "Could not convert the time. Please check your inputs.",
                variant: "destructive",
            });
            setConvertedDateTime(null);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDate, selectedTime, fromZone, toZone, toast]);

    useEffect(() => {
        performConversion();
    }, [performConversion]);

    const handleSetCurrentTimeAndZone = () => {
        const now = new Date();
        setSelectedDate(now);
        setSelectedTime(formatDateFns(now, "HH:mm"));
        setFromZone(getLocalTimeZone());
    };

    return (
        <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Time Zone Converter</h2>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Clock className="w-6 h-6 mr-2" /> Convert Time
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={`w-full justify-start text-left font-normal ${!selectedDate && "text-muted-foreground"}`}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {selectedDate ? (
                                                formatDateFns(
                                                    selectedDate,
                                                    "PPP",
                                                )
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={setSelectedDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Time (HH:MM)</Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={selectedTime}
                                    onChange={(e) =>
                                        setSelectedTime(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fromZone">From Time Zone</Label>
                            <Select
                                value={fromZone}
                                onValueChange={setFromZone}
                            >
                                <SelectTrigger id="fromZone">
                                    <SelectValue placeholder="Select source time zone" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60 overflow-y-auto">
                                    {COMMON_TIMEZONES.map((tz) => (
                                        <SelectItem key={tz} value={tz}>
                                            {tz.replace(/_/g, " ")}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="toZone">To Time Zone</Label>
                            <Select value={toZone} onValueChange={setToZone}>
                                <SelectTrigger id="toZone">
                                    <SelectValue placeholder="Select target time zone" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60 overflow-y-auto">
                                    {COMMON_TIMEZONES.map((tz) => (
                                        <SelectItem key={tz} value={tz}>
                                            {tz.replace(/_/g, " ")}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            variant="outline"
                            onClick={handleSetCurrentTimeAndZone}
                            className="w-full md:w-auto"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Use Current Time & Local Zone
                        </Button>

                        {isLoading && (
                            <div className="text-sm text-muted-foreground">
                                Converting...
                            </div>
                        )}

                        {convertedDateTime && !isLoading && (
                            <div className="mt-6 p-4 bg-secondary/30 rounded-md">
                                <Label>Converted Time</Label>
                                <div className="text-xl font-bold mt-1">
                                    {convertedDateTime}
                                </div>
                            </div>
                        )}
                        {!convertedDateTime &&
                            !isLoading &&
                            selectedDate &&
                            selectedTime && (
                                <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 rounded-md">
                                    <p className="text-sm">
                                        Enter valid date, time, and zones to see
                                        the conversion.
                                    </p>
                                </div>
                            )}
                    </div>
                </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground mt-4 text-center">
                Time zone conversions use IANA time zones. DST is handled
                automatically by the library.
            </p>
        </div>
    );
};

export default TimeZoneConverter;
