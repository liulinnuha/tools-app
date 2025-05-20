import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAdmin } from "@/hooks/useAdmin";
import {
    Menu,
    X,
    ChevronDown,
    Home,
    Grid3X3,
    Heart,
    Search,
    HelpCircle,
    Settings,
    MoonStar,
    Sun,
    ShieldCheck,
    Clock,
    Star,
    Lightbulb,
} from "lucide-react";

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches),
    );
    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const { isAdmin } = useAdmin();

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            localStorage.theme = "dark";
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.theme = "light";
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/all-tools?search=${encodeURIComponent(searchTerm)}`);
            setSearchTerm("");
            closeMenu();
        }
    };

    const isActive = (path: string) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    const navItems = [
        { icon: <Home size={16} />, text: "Home", path: "/" },
        {
            icon: <Grid3X3 size={16} />,
            text: "All Tools",
            path: "/all-tools",
            subItems: [
                {
                    icon: <Clock size={16} />,
                    text: "New Tools",
                    path: "/all-tools?filter=new",
                },
                {
                    icon: <Star size={16} />,
                    text: "Popular Tools",
                    path: "/all-tools?filter=featured",
                },
            ],
        },
        {
            icon: <Grid3X3 size={16} />,
            text: "Categories",
            path: "/categories",
        },
        { icon: <Heart size={16} />, text: "Favorites", path: "/favorites" },
        {
            icon: <Lightbulb size={16} />,
            text: "Suggest Tool",
            path: "/suggest-tool",
        },
        { icon: <HelpCircle size={16} />, text: "Support", path: "/support" },
    ];

    if (isAdmin) {
        navItems.push({
            icon: <ShieldCheck size={16} />,
            text: "Admin",
            path: "/admin",
        });
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 shadow-sm backdrop-blur-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center">
                        <span className="font-bold text-xl">
                            Tool<span className="text-primary">Lolz</span>
                        </span>
                    </Link>

                    {/* Search Bar - Shown on larger screens */}
                    <div className="hidden md:flex items-center max-w-xs w-full mx-4">
                        <form
                            onSubmit={handleSearch}
                            className="relative w-full"
                        >
                            <Input
                                type="text"
                                placeholder="Search tools..."
                                className="pl-9 pr-4 py-2 text-sm rounded-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </form>
                    </div>

                    {/* Mobile action buttons */}
                    <div className="flex md:hidden items-center gap-2">
                        {/* Search icon for mobile */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(true)}
                            aria-label="Search"
                            className="text-muted-foreground"
                        >
                            <Search size={20} />
                        </Button>

                        {/* Theme toggle for mobile - outside hamburger menu */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleDarkMode}
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? (
                                <Sun size={20} />
                            ) : (
                                <MoonStar size={20} />
                            )}
                        </Button>

                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </Button>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-1 lg:space-x-2">
                        {navItems.map((item) =>
                            item.subItems ? (
                                <Popover key={item.path}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={
                                                isActive(item.path)
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            size={isMobile ? "sm" : "default"}
                                            className={cn(
                                                "transition-all",
                                                isActive(item.path)
                                                    ? "font-medium"
                                                    : "text-muted-foreground hover:text-foreground",
                                            )}
                                        >
                                            <span className="flex items-center">
                                                <span className="mr-2">
                                                    {item.icon}
                                                </span>
                                                <span>{item.text}</span>
                                                <ChevronDown className="ml-1 h-4 w-4" />
                                            </span>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 w-56">
                                        <div className="grid gap-1 p-2">
                                            <Link
                                                to={item.path}
                                                onClick={closeMenu}
                                                className="block w-full text-left py-2 px-3 rounded-md hover:bg-secondary"
                                            >
                                                <span className="flex items-center">
                                                    <span className="mr-2">
                                                        {item.icon}
                                                    </span>
                                                    <span>All {item.text}</span>
                                                </span>
                                            </Link>
                                            {item.subItems.map((subItem) => (
                                                <Link
                                                    key={subItem.path}
                                                    to={subItem.path}
                                                    onClick={closeMenu}
                                                    className="block w-full text-left py-2 px-3 rounded-md hover:bg-secondary"
                                                >
                                                    <span className="flex items-center">
                                                        <span className="mr-2">
                                                            {subItem.icon}
                                                        </span>
                                                        <span>
                                                            {subItem.text}
                                                        </span>
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={closeMenu}
                                >
                                    <Button
                                        variant={
                                            isActive(item.path)
                                                ? "default"
                                                : "ghost"
                                        }
                                        size={isMobile ? "sm" : "default"}
                                        className={cn(
                                            "transition-all",
                                            isActive(item.path)
                                                ? "font-medium"
                                                : "text-muted-foreground hover:text-foreground",
                                        )}
                                    >
                                        <span className="flex items-center">
                                            <span className="mr-2">
                                                {item.icon}
                                            </span>
                                            <span>{item.text}</span>
                                        </span>
                                    </Button>
                                </Link>
                            ),
                        )}
                    </nav>

                    {/* User actions - desktop */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* Theme toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleDarkMode}
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? (
                                <Sun size={20} />
                            ) : (
                                <MoonStar size={20} />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-2 pb-4 space-y-2 animate-slide-down">
                        {/* Mobile search */}
                        <form onSubmit={handleSearch} className="px-3 py-2">
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Search tools..."
                                    className="pl-9 pr-4 py-2 w-full text-sm"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                        </form>

                        {/* Mobile navigation items */}
                        {navItems.map((item) => (
                            <React.Fragment key={item.path}>
                                <Link
                                    to={item.path}
                                    onClick={closeMenu}
                                    className={cn(
                                        "block px-3 py-2 rounded-md w-full text-sm font-medium",
                                        isActive(item.path)
                                            ? "bg-primary-foreground text-primary"
                                            : "text-gray-600 hover:bg-secondary dark:text-gray-300",
                                    )}
                                >
                                    <span className="flex items-center">
                                        <span className="mr-2">
                                            {item.icon}
                                        </span>
                                        <span>{item.text}</span>
                                    </span>
                                </Link>
                                {item.subItems && (
                                    <div className="pl-8 space-y-1">
                                        {item.subItems.map((subItem) => (
                                            <Link
                                                key={subItem.path}
                                                to={subItem.path}
                                                onClick={closeMenu}
                                                className="block px-3 py-2 rounded-md w-full text-sm"
                                            >
                                                <span className="flex items-center">
                                                    <span className="mr-2">
                                                        {subItem.icon}
                                                    </span>
                                                    <span>{subItem.text}</span>
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
