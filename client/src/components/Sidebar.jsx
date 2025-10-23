"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  FolderKanban,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  NotepadText,
  Calendar,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";

export function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: FolderKanban, label: "Workspaces", path: "/workspaces" },
    { icon: Users, label: "Team", path: "/team" },
    { icon: NotepadText, label: "Docs", path: "/docs" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const isActive = (path) => location.pathname === path;
  const transitionConfig = { duration: 0.3, ease: [0.4, 0, 0.2, 1] };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 280 : 80,
          x: 0,
        }}
        transition={transitionConfig}
        className="fixed left-0 top-0 h-screen bg-card z-50 flex flex-col shadow-2xl shadow-primary/20"
      >
        {/* Header */}
        <div className="p-4 pt-6 pb-4 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="open"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3"
              >
                <motion.img
                  src={logo}
                  alt="Collatra"
                  className="w-8 h-8 rounded-lg"
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    boxShadow: "0 0 15px var(--primary)",
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                />
                <span className="text-xl font-extrabold text-foreground tracking-tight bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Collatra
                </span>
              </motion.div>
            ) : (
              <motion.img
                key="closed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={logo}
                alt="Collatra"
                className="w-8 h-8 mx-auto rounded-lg"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Toggle Button */}
        <motion.button
          whileHover={{
            scale: 1.1,
            boxShadow: "0 0 15px rgba(var(--primary-rgb), 0.8)",
          }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggle}
          className="absolute -right-4 top-1/2 -translate-y-1/2 bg-card border-2 border-primary/50 text-primary rounded-full p-2 shadow-xl hover:bg-primary hover:text-card transition-colors duration-300 z-50"
        >
          {isOpen ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </motion.button>

        {/* User Info */}
        {user && (
          <motion.div
            className="p-4 pb-6 mt-2"
            animate={{ height: isOpen ? "auto" : "80px" }}
            transition={transitionConfig}
          >
            <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-xl">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold shadow-md"
              >
                {user.name?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
              </motion.div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex-1 overflow-hidden"
                    transition={transitionConfig}
                  >
                    <p className="font-semibold text-foreground text-sm truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{
                    scale: 1.02,
                    x: isOpen ? 6 : 0,
                    boxShadow: active
                      ? "0 0 15px rgba(var(--primary-rgb), 0.4)"
                      : "0 5px 10px rgba(0,0,0,0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 overflow-hidden ${
                    active
                      ? "text-primary-foreground shadow-lg font-bold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground/80"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 bg-gradient-to-r from-primary to-secondary/80 rounded-2xl z-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 z-10 ${
                      active ? "text-card" : "text-primary"
                    }`}
                  />
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="text-sm font-medium z-10"
                        transition={transitionConfig}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="p-4 mt-auto flex flex-col gap-4 items-center border-t border-border/20 pt-6">
          {/* 🟢 Theme Toggle Button Added */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="transition-transform duration-200"
          >
            <ThemeToggle />
          </motion.div>

          {user && (
            <motion.button
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(255, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
              className="flex items-center gap-3 p-3 rounded-xl w-full text-destructive hover:bg-destructive/10 transition-all font-medium justify-center"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-sm"
                  transition={transitionConfig}
                >
                  Logout
                </motion.span>
              )}
            </motion.button>
          )}
        </div>
      </motion.aside>
    </>
  );
}
