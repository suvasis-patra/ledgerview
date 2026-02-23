import React from "react";
import { ModeToggle } from "./ui/theme-button";
import { Wallet } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="w-full py-3">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center justify-center gap-2">
          <Wallet size={28} className="font-semibold" />
          <h3 className="text-2xl md:text-3xl font-bold">
            Ledger<span className="text-green-500">View</span>
          </h3>
        </div>
        <div>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
