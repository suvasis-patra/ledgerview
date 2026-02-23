"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { TWallet } from "@/lib/types";
import CreateWalletScreen from "./create-wallet-screen";
import {
  derivedSeedPhrase,
  generateMnemonics,
  generateSeedBuffer,
  validateMnemonics,
} from "@/lib/utils";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";
import { ethers } from "ethers";
import WalletCard from "./wallet-card";
import { DeleteAlertDialog } from "./alert-dialog";
import MnemonicCard from "./mnemonic-card";
import { json } from "stream/consumers";
import { toast } from "sonner";

const Landing = () => {
  const [wallets, setWallets] = useState<null | TWallet[]>(null);
  const [pathTypes, setPathTypes] = useState<null | string[]>(null);
  const [mnemonicInput, setMnemonicInput] = useState<string>("");
  const [mnemonicWords, setMnemonicWords] = useState<string[]>(
    Array(12).fill(" "),
  );
  const [visiblePhrases, setVisiblePhrases] = useState<boolean[]>([]);
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<boolean[]>([]);
  const pathTypeNames: { [key: string]: string } = {
    "501": "Solana",
    "60": "Ethereum",
  };
  const getNextWalletIndex = (existingWallets: TWallet[] | null) => {
    if (!existingWallets?.length) {
      return 0;
    }

    return (
      Math.max(
        ...existingWallets.map((wallet, idx) =>
          typeof wallet.walletIndex === "number" ? wallet.walletIndex : idx,
        ),
      ) + 1
    );
  };
  const generateWalletFromMnemonics = (
    mnemonics: string,
    pathTypes: string,
    walletIndex: number,
  ): TWallet | null => {
    const seedBuffer = generateSeedBuffer(mnemonics);
    const derivedPath = `m/44'/${pathTypes}'/0'/${walletIndex}'`;

    const derivedSeed = derivedSeedPhrase(
      derivedPath,
      seedBuffer.toString("hex"),
    );

    let privateKeyEncoded: string;
    let publicKeyEncoded: string;

    if (pathTypes === "501") {
      const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed.key);
      const keypair = Keypair.fromSecretKey(secretKey);

      privateKeyEncoded = bs58.encode(secretKey);
      publicKeyEncoded = keypair.publicKey.toBase58();
    } else if (pathTypes === "60") {
      // Ethereum
      const privateKey = Buffer.from(derivedSeed.key).toString("hex");
      privateKeyEncoded = privateKey;

      const wallet = new ethers.Wallet(privateKey);
      publicKeyEncoded = wallet.address;
    } else {
      return null;
    }
    return {
      mnemonic: mnemonics,
      publicKey: publicKeyEncoded,
      privateKey: privateKeyEncoded,
      path: pathTypes,
      walletIndex,
    };
  };
  const handleAddWallet = () => {
    if (!pathTypes?.[0] || !mnemonicWords || !wallets?.length) {
      return;
    }
    const nextWalletIndex = getNextWalletIndex(wallets);
    const wallet = generateWalletFromMnemonics(
      mnemonicWords.join(" "),
      pathTypes[0],
      nextWalletIndex,
    );
    if (wallet) {
      const updatedWallets = [...wallets, wallet];
      setWallets(updatedWallets);
      localStorage.setItem("wallets", JSON.stringify(updatedWallets));
      localStorage.setItem("pathTypes", JSON.stringify(pathTypes));
      setVisiblePrivateKeys([...visiblePrivateKeys, false]);
      setVisiblePhrases([...visiblePhrases, false]);
    }
  };
  const handleDeleteWallet = (idx: number) => {
    if (!wallets || !wallets.length) {
      return;
    }
    const updatedWallets = wallets.filter((_, i) => i !== idx);
    setWallets(updatedWallets);
    localStorage.setItem("wallets", JSON.stringify(updatedWallets));
    localStorage.setItem("pathTypes", JSON.stringify(pathTypes ?? []));
    setVisiblePrivateKeys(visiblePrivateKeys.filter((_, i) => i !== idx));
    setVisiblePhrases(visiblePhrases.filter((_, i) => i !== idx));
    toast.success(`Wallet ${idx + 1} deleted successfully`);
  };
  const handleClearWallets = () => {
    localStorage.removeItem("wallets");
    localStorage.removeItem("mnemonics");
    localStorage.removeItem("pathTypes");
    setWallets([]);
    setMnemonicWords([]);
    setPathTypes([]);
    setVisiblePrivateKeys([]);
    setVisiblePhrases([]);
  };
  const handleGenerateWallet = () => {
    const selectedPathType = pathTypes?.[0];
    if (!selectedPathType) {
      return;
    }

    let mnemonics = mnemonicInput.trim();
    if (mnemonics) {
      if (!validateMnemonics(mnemonics)) {
        console.log("Invalid mnemonic");
      }
    } else {
      mnemonics = generateMnemonics();
    }
    const words = mnemonics.split(" ");
    setMnemonicWords(words);

    const wallet = generateWalletFromMnemonics(
      mnemonics,
      selectedPathType,
      getNextWalletIndex(wallets),
    );
    if (!wallet) {
      return;
    }

    const updatedWallets = [...(wallets ?? []), wallet];
    setWallets(updatedWallets);
    localStorage.setItem("wallets", JSON.stringify(updatedWallets));
    localStorage.setItem("mnemonics", JSON.stringify(words));
    localStorage.setItem("pathTypes", JSON.stringify(pathTypes));
    setVisiblePrivateKeys((prev) => [...prev, false]);
    setVisiblePhrases((prev) => [...prev, false]);
  };
  useEffect(() => {
    const storedWallets = localStorage.getItem("wallets");
    const storedMnemonic = localStorage.getItem("mnemonics");
    const storedPathTypes = localStorage.getItem("pathTypes");
    if (storedWallets && storedMnemonic && storedPathTypes) {
      const parsedWallets = JSON.parse(storedWallets).map(
        (wallet: Omit<TWallet, "walletIndex"> & { walletIndex?: number }, idx: number) => ({
          ...wallet,
          walletIndex:
            typeof wallet.walletIndex === "number" ? wallet.walletIndex : idx,
        }),
      );
      setMnemonicWords(JSON.parse(storedMnemonic));
      setWallets(parsedWallets);
      setPathTypes(JSON.parse(storedPathTypes));
      setVisiblePrivateKeys(parsedWallets.map(() => false));
      setVisiblePhrases(parsedWallets.map(() => false));
      localStorage.setItem("wallets", JSON.stringify(parsedWallets));
    }
  }, []);

  return (
    <div className="px-4 mt-12">
      {!wallets?.length && !pathTypes?.length && (
        <div>
          <h1 className="text-4xl font-bold my-3">
            Ledger<span className="text-green-500">View</span> support multiple
            Blockchains
          </h1>
          <p className="text-xl font-semibold text-gray-400">
            Choose a Blockchain to get started
          </p>
          <div className="flex gap-4 mt-6">
            <Button
              className="cursor-pointer"
              onClick={() => {
                setPathTypes([`60`]);
                console.log(pathTypes);
              }}
            >
              Ethereum
            </Button>
            <Button
              className="cursor-pointer"
              onClick={() => setPathTypes([`501`])}
            >
              Solana
            </Button>
          </div>
        </div>
      )}
      {!wallets?.length && !!pathTypes?.length && (
        <CreateWalletScreen generateWallet={handleGenerateWallet} />
      )}
      {wallets && wallets.length > 0 && mnemonicWords && (
        <MnemonicCard mnemonicWords={mnemonicWords} />
      )}
      {wallets && wallets.length > 0 && (
        <div className="flex flex-col mt-6">
          <div className="flex items-center justify-between my-6">
            <h3 className="text-3xl font-bold">
              {pathTypes?.[0] === "501" ? "Solana" : "Etherium"} Wallets
            </h3>
            <div className="flex items-center justify-center gap-4">
              <Button className="cursor-pointer" onClick={handleAddWallet}>
                Add Wallet
              </Button>
              <DeleteAlertDialog handleClearWallets={handleClearWallets}>
                <Button className="cursor-pointer" variant={"destructive"}>
                  Clear Wallets
                </Button>
              </DeleteAlertDialog>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            {wallets.map(({ publicKey, privateKey, walletIndex }, idx) => (
              <WalletCard
                privateKey={privateKey}
                publicKey={publicKey}
                walletName={`Wallet ${walletIndex + 1}`}
                key={publicKey}
                idx={idx}
                handleDeleteWallet={handleDeleteWallet}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
