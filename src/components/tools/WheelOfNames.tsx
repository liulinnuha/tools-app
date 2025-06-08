import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Plus, RotateCcw, Settings, Play } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface WheelEntry {
    id: number;
    name: string;
    color: string;
}

const WheelOfNames: React.FC = () => {
    const { toast } = useToast();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [entries, setEntries] = useState<WheelEntry[]>([
        { id: 1, name: "Alice", color: "#FF6B6B" },
        { id: 2, name: "Bob", color: "#4ECDC4" },
        { id: 3, name: "Charlie", color: "#45B7D1" },
        { id: 4, name: "Diana", color: "#96CEB4" },
    ]);
    const [newEntry, setNewEntry] = useState<string>("");
    const [bulkEntries, setBulkEntries] = useState<string>("");
    const [isSpinning, setIsSpinning] = useState<boolean>(false);
    const [rotation, setRotation] = useState<number>(0);
    const [winner, setWinner] = useState<WheelEntry | null>(null);
    const [spinDuration, setSpinDuration] = useState<number>(3000);
    const [showWinnerDialog, setShowWinnerDialog] = useState<boolean>(false);

    const colors = [
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
        "#96CEB4",
        "#FECA57",
        "#FF9FF3",
        "#54A0FF",
        "#5F27CD",
        "#00D2D3",
        "#FF9F43",
        "#FF6348",
        "#2ED573",
        "#3742FA",
        "#F8B500",
        "#7bed9f",
    ];

    useEffect(() => {
        drawWheel();
    }, [entries, rotation]);

    const drawWheel = () => {
        const canvas = canvasRef.current;
        if (!canvas || entries.length === 0) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((rotation * Math.PI) / 180);

        const anglePerEntry = (2 * Math.PI) / entries.length;

        entries.forEach((entry, index) => {
            const startAngle = index * anglePerEntry;
            const endAngle = (index + 1) * anglePerEntry;

            // Draw slice
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = entry.color;
            ctx.fill();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 3;
            ctx.stroke();

            // Draw text
            ctx.save();
            ctx.rotate(startAngle + anglePerEntry / 2);
            ctx.textAlign = "left";
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 16px Arial";
            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.shadowBlur = 2;
            ctx.fillText(entry.name, radius * 0.3, 5);
            ctx.restore();
        });

        ctx.restore();

        // Draw pointer
        ctx.beginPath();
        ctx.moveTo(centerX - 15, centerY - radius - 10);
        ctx.lineTo(centerX + 15, centerY - radius - 10);
        ctx.lineTo(centerX, centerY - radius + 10);
        ctx.closePath();
        ctx.fillStyle = "#2c3e50";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
        ctx.fillStyle = "#2c3e50";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.stroke();
    };

    const addEntry = () => {
        if (!newEntry.trim()) {
            toast({
                title: "Empty Entry",
                description: "Please enter a name to add",
                variant: "destructive",
            });
            return;
        }

        // Check for duplicate names
        if (
            entries.some(
                (entry) =>
                    entry.name.toLowerCase() === newEntry.trim().toLowerCase(),
            )
        ) {
            toast({
                title: "Duplicate Entry",
                description: "This name already exists in the wheel",
                variant: "destructive",
            });
            return;
        }

        const newId = Math.max(...entries.map((e) => e.id), 0) + 1;
        const newColor = colors[entries.length % colors.length];

        setEntries([
            ...entries,
            {
                id: newId,
                name: newEntry.trim(),
                color: newColor,
            },
        ]);
        setNewEntry("");
    };

    const removeEntry = (id: number) => {
        setEntries(entries.filter((entry) => entry.id !== id));
    };

    const addBulkEntries = () => {
        if (!bulkEntries.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter names separated by new lines",
                variant: "destructive",
            });
            return;
        }

        const names = bulkEntries
            .split("\n")
            .map((name) => name.trim())
            .filter((name) => name.length > 0);

        if (names.length === 0) {
            toast({
                title: "No Valid Names",
                description: "Please enter valid names",
                variant: "destructive",
            });
            return;
        }

        // Filter out duplicates
        const existingNames = entries.map((e) => e.name.toLowerCase());
        const uniqueNames = names.filter(
            (name) => !existingNames.includes(name.toLowerCase()),
        );

        if (uniqueNames.length === 0) {
            toast({
                title: "All Names Already Exist",
                description: "All entered names are already in the wheel",
                variant: "destructive",
            });
            return;
        }

        const startId = Math.max(...entries.map((e) => e.id), 0) + 1;
        const newEntries = uniqueNames.map((name, index) => ({
            id: startId + index,
            name,
            color: colors[(entries.length + index) % colors.length],
        }));

        setEntries([...entries, ...newEntries]);
        setBulkEntries("");

        const duplicateCount = names.length - uniqueNames.length;
        const message =
            duplicateCount > 0
                ? `Added ${uniqueNames.length} entries (${duplicateCount} duplicates skipped)`
                : `Added ${uniqueNames.length} entries to the wheel`;

        toast({
            title: "Success",
            description: message,
        });
    };

    const spinWheel = () => {
        if (entries.length === 0) {
            toast({
                title: "No Entries",
                description: "Please add some names to the wheel first",
                variant: "destructive",
            });
            return;
        }

        if (isSpinning) return;

        setIsSpinning(true);
        setWinner("");

        const spinAmount = 1440 + Math.random() * 1440; // 4-8 full rotations
        const finalRotation = (rotation + spinAmount) % 360;

        // Animate the spin
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / spinDuration, 1);

            // Easing function for natural deceleration
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentRotation = rotation + spinAmount * easeOut;

            setRotation(currentRotation % 360);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Determine winner
                const anglePerEntry = 360 / entries.length;
                const winnerIndex =
                    Math.floor((360 - (finalRotation % 360)) / anglePerEntry) %
                    entries.length;
                const winnerEntry = entries[winnerIndex];

                setWinner(winnerEntry);
                setShowWinnerDialog(true);
                setIsSpinning(false);
            }
        };

        animate();
    };

    const resetWheel = () => {
        setRotation(0);
        setWinner(null);
    };

    const clearAllEntries = () => {
        setEntries([]);
        setWinner(null);
        setRotation(0);
    };

    const handleWinnerKeep = () => {
        setShowWinnerDialog(false);
        toast({
            title: "🎉 Winner Selected!",
            description: `Congratulations to ${winner?.name}!`,
        });
    };

    const handleWinnerRemove = () => {
        if (winner) {
            setEntries(entries.filter((entry) => entry.id !== winner.id));
            toast({
                title: "Winner Removed",
                description: `${winner.name} has been removed from the wheel`,
            });
        }
        setShowWinnerDialog(false);
        setWinner(null);
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-3xl font-bold mb-6 text-center">
                Wheel of Names
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Wheel Section */}
                <div className="space-y-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center space-y-4">
                                <canvas
                                    ref={canvasRef}
                                    width={400}
                                    height={400}
                                    className="border border-gray-200 rounded-full cursor-pointer hover:shadow-lg transition-shadow"
                                    onClick={spinWheel}
                                />

                                <div className="flex gap-2">
                                    <Button
                                        onClick={spinWheel}
                                        disabled={
                                            isSpinning || entries.length === 0
                                        }
                                        className="flex-1"
                                    >
                                        <Play className="w-4 h-4 mr-2" />
                                        {isSpinning
                                            ? "Spinning..."
                                            : "Spin Wheel"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={resetWheel}
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </Button>
                                </div>

                                {winner && !showWinnerDialog && (
                                    <div className="text-center p-4 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg border-2 border-yellow-300">
                                        <p className="text-sm font-medium text-yellow-800">
                                            🎉 Winner:
                                        </p>
                                        <div className="flex items-center justify-center gap-2 mt-1">
                                            <div
                                                className="w-4 h-4 rounded-full border-2 border-yellow-600"
                                                style={{
                                                    backgroundColor:
                                                        winner.color,
                                                }}
                                            />
                                            <p className="text-2xl font-bold text-yellow-900">
                                                {winner.name}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Controls Section */}
                <div className="space-y-4">
                    <Tabs defaultValue="single" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="single">Add Single</TabsTrigger>
                            <TabsTrigger value="bulk">Add Bulk</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                        </TabsList>

                        <TabsContent value="single" className="space-y-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="newEntry">
                                            Add New Entry
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="newEntry"
                                                placeholder="Enter a name"
                                                value={newEntry}
                                                onChange={(e) =>
                                                    setNewEntry(e.target.value)
                                                }
                                                onKeyPress={(e) =>
                                                    e.key === "Enter" &&
                                                    addEntry()
                                                }
                                            />
                                            <Button onClick={addEntry}>
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="bulk" className="space-y-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="bulkEntries">
                                            Add Multiple Entries
                                        </Label>
                                        <Textarea
                                            id="bulkEntries"
                                            placeholder="Enter names, one per line&#10;Alice&#10;Bob&#10;Charlie"
                                            value={bulkEntries}
                                            onChange={(e) =>
                                                setBulkEntries(e.target.value)
                                            }
                                            rows={6}
                                        />
                                        <Button
                                            onClick={addBulkEntries}
                                            className="w-full"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add All Entries
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="settings" className="space-y-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="spinDuration">
                                                Spin Duration (ms)
                                            </Label>
                                            <Input
                                                id="spinDuration"
                                                type="number"
                                                min="1000"
                                                max="10000"
                                                step="500"
                                                value={spinDuration}
                                                onChange={(e) =>
                                                    setSpinDuration(
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 3000,
                                                    )
                                                }
                                            />
                                        </div>
                                        <Button
                                            variant="destructive"
                                            onClick={clearAllEntries}
                                            className="w-full"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Clear All Entries
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Current Entries */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <Label>
                                        Current Entries ({entries.length})
                                    </Label>
                                    {entries.length > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearAllEntries}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>

                                {entries.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-4">
                                        No entries yet. Add some names to get
                                        started!
                                    </p>
                                ) : (
                                    <div className="max-h-60 overflow-y-auto space-y-2">
                                        {entries.map((entry) => (
                                            <div
                                                key={entry.id}
                                                className="flex items-center justify-between p-2 bg-secondary/20 rounded"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-4 h-4 rounded-full border"
                                                        style={{
                                                            backgroundColor:
                                                                entry.color,
                                                        }}
                                                    />
                                                    <span className="font-medium">
                                                        {entry.name}
                                                    </span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        removeEntry(entry.id)
                                                    }
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Winner Dialog */}
            <AlertDialog
                open={showWinnerDialog}
                onOpenChange={setShowWinnerDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center text-2xl">
                            🎉 We have a winner!
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="text-center">
                                {winner && (
                                    <div className="flex items-center justify-center gap-3 mt-4">
                                        <div
                                            className="w-6 h-6 rounded-full border-2 border-gray-400"
                                            style={{
                                                backgroundColor: winner.color,
                                            }}
                                        />
                                        <span className="text-3xl font-bold text-gray-600">
                                            {winner.name}
                                        </span>
                                    </div>
                                )}
                                <p className="text-sm text-gray-600 mt-3">
                                    What would you like to do with this winner?
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel
                            onClick={handleWinnerKeep}
                            className="w-full sm:w-auto"
                        >
                            Keep in Wheel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleWinnerRemove}
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                        >
                            Remove from Wheel
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default WheelOfNames;
