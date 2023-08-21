import * as React from "react";
import Image from "next/image";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

interface AssistantChatCardProps {
  text?: string;
  sources?: string;
}

export function AssistantChatCard({ text = "Hi, how can I help you?", sources = "" }: AssistantChatCardProps) {
  return (
    <div className="mb-[25px] ml-[25px] mt-[20px]">
      <Card className="w-[350px]">
        <CardHeader>
          <Image src="/favicon.ico" alt="Favicon" width={75} height={76} />
          <CardTitle>
            Genie
          </CardTitle>
          <CardDescription>
            {text}
            {sources && (
              <> ({sources})</>
            )}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
