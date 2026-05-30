"use client";

import { Ban, CheckCircle } from "lucide-react";

type Props = {
  id: string;
  banned: boolean;
  onBanClick: (id: string, banned: boolean) => void;
};

export function BanearButton({ id, banned, onBanClick }: Props) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onBanClick(id, banned); }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
        banned
          ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
          : "bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30"
      }`}
    >
      {banned ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
      {banned ? "Desbanear" : "Banear"}
    </button>
  );
}
