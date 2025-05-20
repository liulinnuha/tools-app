import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        // Load favorites from localStorage on component mount
        const storedFavorites = localStorage.getItem("toolsFavorites");
        // For backward compatibility, also check the old wishlist key
        const storedWishlist = localStorage.getItem("toolsWishlist");

        if (storedFavorites) {
            try {
                setFavorites(JSON.parse(storedFavorites));
            } catch (error) {
                console.error("Error parsing favorites data:", error);
                setFavorites([]);
            }
        } else if (storedWishlist) {
            // Migrate from wishlist to favorites
            try {
                const wishlistData = JSON.parse(storedWishlist);
                setFavorites(wishlistData);
                localStorage.setItem(
                    "toolsFavorites",
                    JSON.stringify(wishlistData),
                );
                // Optionally remove old wishlist data
                // localStorage.removeItem('toolsWishlist');
            } catch (error) {
                console.error("Error migrating wishlist data:", error);
                setFavorites([]);
            }
        } else {
            // Initialize empty favorites if none exists
            localStorage.setItem("toolsFavorites", JSON.stringify([]));
        }
    }, []);

    const addToFavorites = (toolId: string, toolName: string) => {
        if (!favorites.includes(toolId)) {
            const newFavorites = [...favorites, toolId];
            setFavorites(newFavorites);
            localStorage.setItem(
                "toolsFavorites",
                JSON.stringify(newFavorites),
            );

            toast({
                title: "Added to favorites",
                description: `${toolName} has been added to your favorites.`,
                variant: "default",
            });
        }
    };

    const removeFromFavorites = (toolId: string, toolName: string) => {
        if (favorites.includes(toolId)) {
            const newFavorites = favorites.filter((id) => id !== toolId);
            setFavorites(newFavorites);
            localStorage.setItem(
                "toolsFavorites",
                JSON.stringify(newFavorites),
            );

            toast({
                title: "Removed from favorites",
                description: `${toolName} has been removed from your favorites.`,
                variant: "default",
            });
        }
    };

    const toggleFavorite = (toolId: string, toolName: string) => {
        if (favorites.includes(toolId)) {
            removeFromFavorites(toolId, toolName);
        } else {
            addToFavorites(toolId, toolName);
        }
    };

    const isInFavorites = (toolId: string): boolean => {
        return favorites.includes(toolId);
    };

    const clearFavorites = () => {
        setFavorites([]);
        localStorage.setItem("toolsFavorites", JSON.stringify([]));
    };

    return {
        favorites,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isInFavorites,
        clearFavorites,
    };
}
