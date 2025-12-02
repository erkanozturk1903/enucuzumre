"use client";

import { useState } from "react";
import { Building2, Copy, Check } from "lucide-react";

interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  iban: string;
  branch: string | null;
  logo: string | null;
}

interface BankAccountListProps {
  accounts: BankAccount[];
}

export function BankAccountList({ accounts }: BankAccountListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (iban: string, id: string) => {
    navigator.clipboard.writeText(iban.replace(/\s/g, ""));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <div
          key={account.id}
          className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start gap-4">
            <div className="bg-[#059669]/10 p-3 rounded-xl flex-shrink-0">
              {account.logo ? (
                <img
                  src={account.logo}
                  alt={account.bankName}
                  className="h-6 w-6 object-contain"
                />
              ) : (
                <Building2 className="h-6 w-6 text-[#059669]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-primary mb-3">{account.bankName}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">Hesap Adı:</span>
                  <span className="font-medium text-gray-700 text-right">{account.accountName}</span>
                </div>
                {account.branch && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">Şube:</span>
                    <span className="font-medium text-gray-700">{account.branch}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500">IBAN:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-gray-700 text-sm">{account.iban}</span>
                    <button
                      onClick={() => copyToClipboard(account.iban, account.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Kopyala"
                    >
                      {copiedId === account.id ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
