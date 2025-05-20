import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

export function useWishlist() {
    const [wishlist, setWishlist] = useState<string[]>([]);

    useEffect(() => {
        // Load wishlist from localStorage on component mount
        const storedWishlist = localStorage.getItem("toolsWishlist");
        if (storedWishlist) {
            try {
                setWishlist(JSON.parse(storedWishlist));
            } catch (error) {
                console.error("Error parsing wishlist data:", error);
                setWishlist([]);
            }
        } else {
            // Initialize empty wishlist if none exists
            localStorage.setItem("toolsWishlist", JSON.stringify([]));
        }
    }, []);

    const addToWishlist = (toolId: string, toolName: string) => {
        if (!wishlist.includes(toolId)) {
            const newWishlist = [...wishlist, toolId];
            setWishlist(newWishlist);
            localStorage.setItem("toolsWishlist", JSON.stringify(newWishlist));

            toast({
                title: "Added to wishlist",
                description: `${toolName} has been added to your wishlist.`,
                variant: "default",
            });
        }
    };

    const removeFromWishlist = (toolId: string, toolName: string) => {
        if (wishlist.includes(toolId)) {
            const newWishlist = wishlist.filter((id) => id !== toolId);
            setWishlist(newWishlist);
            localStorage.setItem("toolsWishlist", JSON.stringify(newWishlist));

            toast({
                title: "Removed from wishlist",
                description: `${toolName} has been removed from your wishlist.`,
                variant: "default",
            });
        }
    };

    const toggleWishlist = (toolId: string, toolName: string) => {
        if (wishlist.includes(toolId)) {
            removeFromWishlist(toolId, toolName);
        } else {
            addToWishlist(toolId, toolName);
        }
    };

    const isInWishlist = (toolId: string): boolean => {
        return wishlist.includes(toolId);
    };

    return {
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
    };
}
