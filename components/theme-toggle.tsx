/** @format */

"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "./language-provider";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MotionButton } from "./ui/motion";

export default function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme("dark");
  }, []);

  if (!mounted) return null;

  const currentTheme = resolvedTheme || theme || "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MotionButton
          className="h-8 w-8 rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="relative w-[1.2rem] h-[1.2rem]">
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={false}
              animate={{ opacity: currentTheme === "dark" ? 0 : 1 }}
              transition={{ duration: 0.15 }}
            >
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={false}
              animate={{ opacity: currentTheme === "dark" ? 1 : 0 }}
              transition={{ duration: 0.15 }}
            >
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            </motion.div>
          </div>
          <span className="sr-only">Toggle theme</span>
        </MotionButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <motion.div whileHover={{ x: 5 }}>
          <DropdownMenuItem onClick={() => setTheme("light")}>
            {t("common.lightMode")}
          </DropdownMenuItem>
        </motion.div>
        <motion.div whileHover={{ x: 5 }}>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            {t("common.darkMode")}
          </DropdownMenuItem>
        </motion.div>
        <motion.div whileHover={{ x: 5 }}>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            {t("common.systemTheme")}
          </DropdownMenuItem>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
