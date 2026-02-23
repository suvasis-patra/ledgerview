import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Eye, EyeOff, Trash } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

type WalletCardProps = {
  privateKey: string;
  publicKey: string;
  walletName: string;
  idx: number;
  handleDeleteWallet: (idx: number) => void;
};

const WalletCard = ({
  walletName,
  privateKey,
  publicKey,
  idx,
  handleDeleteWallet,
}: WalletCardProps) => {
  const [togglePrivatekeyVisibility, setTogglePrivatekeyVisibility] =
    useState(false);
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <CardTitle className="text-3xl font-semibold">{walletName}</CardTitle>
          <Button
            size={"icon"}
            className="cursor-pointer"
            variant={"ghost"}
            onClick={() => handleDeleteWallet(idx)}
          >
            <Trash className="text-red-500" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold my-3">
              Public Key
            </h3>
            <div
              onClick={() => copyToClipboard(publicKey)}
              className="cursor-pointer"
            >
              <p className="md:text-xl truncate">{publicKey}</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-semibold my-3">
              Private Key
            </h3>
            <div className="flex w-full items-center justify-between">
              <p
                className="text-primary/80 font-medium cursor-pointer hover:text-primary transition-all duration-300 truncate md:text-xl"
                onClick={() => copyToClipboard(privateKey)}
              >
                {togglePrivatekeyVisibility
                  ? `${privateKey}`
                  : `•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••`}
              </p>
              <Button
                size={"icon"}
                variant={"ghost"}
                className="cursor-pointer"
                onClick={() => setTogglePrivatekeyVisibility((prev) => !prev)}
              >
                {togglePrivatekeyVisibility ? <EyeOff /> : <Eye />}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
