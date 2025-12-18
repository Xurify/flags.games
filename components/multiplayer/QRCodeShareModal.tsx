"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { LinkIcon, CopyIcon, CopyCheckIcon, QrCodeIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/strings";

interface QRCodeShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteLink: string;
}

export default function QRCodeShareModal({
  isOpen,
  onClose,
  inviteLink,
}: QRCodeShareModalProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen && inviteLink) {
      generateQRCode();
    }
  }, [isOpen, inviteLink]);

  const generateQRCode = async () => {
    if (!inviteLink) return;

    setIsGenerating(true);
    try {
      const dataUrl = await QRCode.toDataURL(inviteLink, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Invite link copied to clipboard");
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Failed to copy link");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="w-full max-w-md sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-2xl font-black uppercase tracking-tight">
            <QrCodeIcon className="w-6 h-6" />
            Share Room Invite
          </AlertDialogTitle>
          <AlertDialogDescription className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Share this room with others using the QR code or invite link below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white border-2 border-foreground shadow-retro">
              {isGenerating ? (
                <div className="w-48 h-48 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="Room invite QR code"
                  className="w-48 h-48"
                  style={{ imageRendering: "pixelated" }}
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-muted">
                  <span className="text-5xl text-muted-foreground font-black">?</span>
                </div>
              )}
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-center">
              Scan Code to Join
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest font-bold text-muted-foreground ml-1">
              Invite Link
            </label>
            <div
              className="flex items-center gap-2 p-1 bg-muted/20 border-2 border-foreground shadow-retro-sm"
              onClick={handleCopyLink}
            >
              <div className="pl-3 text-muted-foreground">
                <LinkIcon className="w-4 h-4" />
              </div>
              <input
                className={cn(
                  "flex-1 border-0 bg-transparent shadow-none text-sm font-bold font-mono h-10 px-2 truncate w-full cursor-pointer outline-none focus:ring-0 focus:outline-none placeholder:text-muted-foreground",
                  copiedLink && "text-green-600"
                )}
                value={inviteLink.replace("https://", "")}
                readOnly
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyLink();
                }}
                className="h-10 w-10 hover:bg-transparent hover:text-primary transition-colors"
              >
                {copiedLink ? (
                  <CopyCheckIcon className="w-4 h-4 text-green-600" />
                ) : (
                  <CopyIcon className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="mt-4">
          <AlertDialogAction
            onClick={onClose}
            className="w-full h-12 font-black uppercase text-lg border-2 border-foreground shadow-retro bg-primary text-primary-foreground hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
