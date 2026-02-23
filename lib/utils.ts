import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateMnemonics = () => {
  return bip39.generateMnemonic();
};

export const validateMnemonics = (mnemonic: string) => {
  return bip39.validateMnemonic(mnemonic);
};

export const generateSeedBuffer = (mnemonic: string) => {
  return bip39.mnemonicToSeedSync(mnemonic);
};

export const derivedSeedPhrase = (path: string, seedBuffer: string) => {
  return derivePath(path, seedBuffer);
};

export const copyToClipboard = (content: string) => {
  navigator.clipboard.writeText(content);
  toast.success("Copied to clipboard!");
};
