"use client";

import { uploadProfileImage } from "@/app/(root)/dashboard/profile/actions";
import { UserType } from "@/components/app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { initials } from "@/lib/user-helper";
import { Camera, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ProfileImageUploadProps {
  user: UserType;
  onChange: (url: string) => void;
}

export function ProfileImageUpload({
  user,
  onChange,
}: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(user.profile || "");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérification du type de fichier
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    // Vérification de la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const url = await uploadProfileImage(formData);
      setImageUrl(url);
      onChange(url);
      toast.success("Image de profil mise à jour");
    } catch (error) {
      toast.error("Erreur lors de l'upload de l'image");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <FormItem>
        <FormLabel>Photo de profil</FormLabel>
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={imageUrl} alt={user.name} />
            <AvatarFallback className="text-xl">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>

          <FormControl>
            <div className="flex flex-col gap-2">
              <label htmlFor="profile-image" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading}
                    onClick={() =>
                      document.getElementById("profile-image")?.click()
                    }
                  >
                    {isUploading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="mr-2 h-4 w-4" />
                    )}
                    Changer d&apos;image
                  </Button>
                </div>
                <Input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
              <FormDescription>JPG, PNG ou GIF. 5MB maximum.</FormDescription>
            </div>
          </FormControl>
        </div>
        <FormMessage />
      </FormItem>
    </div>
  );
}
