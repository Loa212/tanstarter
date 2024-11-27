import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { twoFactor } from "~/lib/auth-client";
import { UAParser } from "ua-parser-js";
import { Laptop, Loader2, Phone, ShieldCheck, ShieldOff } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: Home,
});

function Home() {
  const { session } = Route.useRouteContext();

  const [twoFactorDialog, setTwoFactorDialog] = useState(false);
  const [twoFaPassword, setTwoFaPassword] = useState("");
  const [isPendingTwoFa, setIsPendingTwoFa] = useState(false);
  const [twoFactorVerifyURI, setTwoFactorVerifyURI] = useState<string>("");
  return (
    <div className="container flex min-h-[80vh] items-center justify-center">
      <Card className="w-fit">
        {session?.user && (
          <>
            <CardHeader>
              <CardTitle>Welcome, {session?.user.name}!</CardTitle>
              <CardDescription>
                You are signed in as {session?.user.email}.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-start gap-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  {new UAParser(session?.session.userAgent ?? "").getDevice().type ===
                  "mobile" ? (
                    <Phone />
                  ) : (
                    <Laptop size={16} />
                  )}
                  {new UAParser(session?.session.userAgent ?? "").getOS().name},{" "}
                  {new UAParser(session?.session.userAgent ?? "").getBrowser().name}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Dialog open={twoFactorDialog} onOpenChange={setTwoFactorDialog}>
                    <DialogTrigger asChild>
                      <Button
                        variant={
                          session?.user.twoFactorEnabled ? "destructive" : "outline"
                        }
                        className="gap-2"
                      >
                        {session?.user.twoFactorEnabled ? (
                          <ShieldOff size={16} />
                        ) : (
                          <ShieldCheck size={16} />
                        )}
                        <span className="text-xs md:text-sm">
                          {session?.user.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-11/12 sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>
                          {session?.user.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                        </DialogTitle>
                        <DialogDescription>
                          {session?.user.twoFactorEnabled
                            ? "Disable the second factor authentication from your account"
                            : "Enable 2FA to secure your account"}
                        </DialogDescription>
                      </DialogHeader>

                      {twoFactorVerifyURI ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-center">
                            <QRCode value={twoFactorVerifyURI} />
                          </div>
                          <Label htmlFor="password">
                            Scan the QR code with your TOTP app
                          </Label>
                          <Input
                            value={twoFaPassword}
                            onChange={(e) => setTwoFaPassword(e.target.value)}
                            placeholder="Enter OTP"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={twoFaPassword}
                            onChange={(e) => setTwoFaPassword(e.target.value)}
                          />
                        </div>
                      )}
                      <DialogFooter>
                        <Button
                          disabled={isPendingTwoFa}
                          onClick={async () => {
                            if (twoFaPassword.length < 8 && !twoFactorVerifyURI) {
                              toast.error("Password must be at least 8 characters");
                              return;
                            }
                            setIsPendingTwoFa(true);
                            if (session?.user.twoFactorEnabled) {
                              await twoFactor.disable({
                                password: twoFaPassword,
                                fetchOptions: {
                                  onError(context) {
                                    toast.error(context.error.message);
                                  },
                                  onSuccess() {
                                    toast("2FA disabled successfully");
                                    setTwoFactorDialog(false);
                                  },
                                },
                              });
                            } else {
                              if (twoFactorVerifyURI) {
                                await twoFactor.verifyTotp({
                                  code: twoFaPassword,
                                  fetchOptions: {
                                    onError(context) {
                                      setIsPendingTwoFa(false);
                                      setTwoFaPassword("");
                                      toast.error(context.error.message);
                                    },
                                    onSuccess() {
                                      toast("2FA enabled successfully");
                                      setTwoFactorVerifyURI("");
                                      setIsPendingTwoFa(false);
                                      setTwoFaPassword("");
                                      setTwoFactorDialog(false);
                                    },
                                  },
                                });
                                return;
                              }
                              await twoFactor.enable({
                                password: twoFaPassword,
                                fetchOptions: {
                                  onError(context) {
                                    toast.error(context.error.message);
                                  },
                                  onSuccess(ctx) {
                                    setTwoFactorVerifyURI(ctx.data.totpURI);
                                  },
                                },
                              });
                            }
                            setIsPendingTwoFa(false);
                            setTwoFaPassword("");
                          }}
                        >
                          {isPendingTwoFa ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : session?.user.twoFactorEnabled ? (
                            "Disable 2FA"
                          ) : (
                            "Enable 2FA"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
