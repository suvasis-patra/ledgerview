"use client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const CreateWalletScreen = ({
  generateWallet,
}: {
  generateWallet: () => void;
}) => {
  return (
    <section className="mt-8 md:mt-12">
      <h1 className="text-3xl md:text-4xl font-bold my-2">
        Your secret <span className="text-green-600">recovery phrase</span>
      </h1>
      <p className="mb-3 font-semibold text-gray-300">
        Save these words in a safe place
      </p>
      <div className="w-full flex flex-col md:flex-row md:items-center gap-5">
        <Input
          type="password"
          placeholder="Paste your secret phrase here (or leave it blank to generate new)"
          className="h-12"
        />
        <Button
          onClick={() => generateWallet()}
          className="py-6 px-5 font-semibold cursor-pointer"
        >
          Generate Wallet
        </Button>
      </div>
    </section>
  );
};

export default CreateWalletScreen;
