import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { tools, categories } from "@/data/tools";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import CategoryCard from "@/components/ui/CategoryCard";

const CategoriesPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCategories = categories.filter(
        (category) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
    );

    const getToolsByCategoryId = (categoryId: string) => {
        return tools.filter((tool) => tool.category.id === categoryId);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow pt-16 md:pt-24 pb-6 md:pb-10">
                <div className="container mx-auto px-4">
                    {/* Page Header */}
                    <div className="mb-6 md:mb-8 animate-fade-in">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">
                            All Categories
                        </h1>
                        <p className="text-muted-foreground max-w-2xl">
                            Browse all tool categories available on our
                            platform. Find the perfect tools for your needs
                            organized by category.
                        </p>
                    </div>

                    {/* Search Input */}
                    <div className="mb-6 md:mb-8 relative max-w-xl animate-slide-up">
                        <Input
                            type="text"
                            placeholder="Search categories..."
                            className="pl-10 pr-4 py-3 md:py-6 rounded-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    </div>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-fade-in">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                                <CategoryCard
                                    key={category.id}
                                    category={category}
                                    toolCount={
                                        getToolsByCategoryId(category.id).length
                                    }
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center p-8 glass-card">
                                <p className="text-muted-foreground">
                                    No categories found matching your search.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CategoriesPage;
