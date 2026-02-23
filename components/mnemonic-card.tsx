import { ChevronDown, ChevronUp, Clipboard } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";
import { copyToClipboard } from "@/lib/utils";

const MnemonicCard = ({ mnemonicWords }: { mnemonicWords: string[] }) => {
  const [showMnemonic, setShowMnemonic] = useState(false);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle
          className="text-3xl font-semibold flex items-center justify-between cursor-pointer"
          onClick={() => setShowMnemonic((prev) => !prev)}
        >
          <h2>Your Secret Phrase</h2>
          <Button variant={"ghost"} size={"icon"}>
            {!showMnemonic ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </CardTitle>
      </CardHeader>
      {showMnemonic && (
        <CardContent
          className="cursor-pointer"
          onClick={() => copyToClipboard(mnemonicWords.join(" "))}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 justify-center w-full items-center mx-auto my-8">
            {mnemonicWords.map((word) => (
              <span
                className="md:text-lg bg-foreground/5 hover:bg-foreground/10 transition-all duration-300 rounded-lg p-4"
                key={word}
              >
                {word}
              </span>
            ))}
          </div>
          <p className="flex items-center justify-start gap-3">
            <span>
              <Clipboard />
            </span>
            Click anywhere to copy the phrase
          </p>
        </CardContent>
      )}
    </Card>
  );
};

export default MnemonicCard;
