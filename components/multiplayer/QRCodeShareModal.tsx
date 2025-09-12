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
      <AlertDialogContent className="w-full">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <QrCodeIcon className="w-5 h-5" />
            Share Room Invite
          </AlertDialogTitle>
          <AlertDialogDescription>
            Share this room with others using the QR code or invite link below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col items-center space-y-3">
            <div className="p-4 bg-whit dark:bg-input rounded-lg border-2 border-gray-200">
              {isGenerating ? (
                <div className="w-64 h-64 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-white rounded-full animate-spin mr-2" />
                </div>
              ) : qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="Room invite QR code"
                  className="w-64 h-64"
                />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded">
                  <span className="text-5xl text-gray-400">?</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Scan this QR code to join the room
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Invite Link
            </label>
            <div
              className="flex items-center gap-2 p-3 bg-muted rounded-lg w-full cursor-pointer"
              onClick={handleCopyLink}
            >
              <LinkIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <Input className={cn("text-sm text-muted-foreground truncate flex-1 w-full cursor-pointer", copiedLink && "bg-green-100 text-green-600 dark:bg-green-600/30 dark:text-green-600")} value={inviteLink.replace("https://", "")} />
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyLink();
                }}
                className="h-8 w-8 p-0"
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

        <AlertDialogFooter>
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <AlertDialogAction
              onClick={onClose}
              className="flex-1"
              variant="outline"
            >
              Close
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
