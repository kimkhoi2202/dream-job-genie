import * as React from "react";
import Image from "next/image";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AssistantChatCard({ text = "Hi, how can I help you?" }) {
  return (
    <div className="mb-[25px] ml-[25px] mt-[20px]">
      <Card className="w-[350px]">
        <CardHeader>
          <Image src="/favicon.ico" alt="Favicon" width={75} height={76} />
          <CardTitle>
            Genie
          </CardTitle>
          <CardDescription>{text}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
