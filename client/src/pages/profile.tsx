import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { User, Camera, Save, Upload, Trash2 } from "lucide-react";
import type { User as UserType } from "@shared/schema";

export default function Profile() {
  const { user } = useAuth() as { user: UserType | null };
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [profileImage, setProfileImage] = useState(user?.profileImageUrl || "");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");

  // Update form state when user data changes
  useEffect(() => {
    if (user) {
      setProfileImage(user.profileImageUrl || "");
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { 
      firstName?: string; 
      lastName?: string; 
      profileImageUrl?: string;
    }) => {
      return await apiRequest(`/api/user/profile`, {
        method: "PATCH",
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated!",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resizeAndCompressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Resize to max 300x300 for profile photos
        const maxSize = 300;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
        resolve(compressedBase64);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please choose an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      try {
        const compressedBase64 = await resizeAndCompressImage(file);
        setProfileImage(compressedBase64);
        
        toast({
          title: "Image Loaded",
          description: "Image has been optimized and is ready to save.",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Failed to process the image. Please try another file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleImageUrlChange = (url: string) => {
    setProfileImage(url);
  };

  const handleRemoveImage = () => {
    setProfileImage("");
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      firstName,
      lastName,
      profileImageUrl: profileImage,
    });
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Please log in to access your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8 max-w-4xl pt-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your personal information and profile picture</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-blue-600" />
                Profile Picture
              </CardTitle>
              <CardDescription>Upload or change your profile photo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Profile Picture */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32 border-4 border-gray-200 dark:border-gray-700">
                  <AvatarImage 
                    src={profileImage} 
                    alt="Profile" 
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    {getInitials(firstName, lastName)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    JPG, PNG or GIF (max 5MB)
                  </p>
                </div>
              </div>

              {/* Upload Options */}
              <div className="space-y-3">
                {/* File Upload */}
                <div>
                  <Label htmlFor="image-upload" className="block text-sm font-medium mb-2">
                    Upload from device
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                </div>

                {/* URL Input */}
                <div>
                  <Label htmlFor="image-url" className="block text-sm font-medium mb-2">
                    Or enter image URL
                  </Label>
                  <Input
                    id="image-url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={profileImage.startsWith('data:') ? '' : profileImage}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                  />
                </div>

                {/* Remove Image */}
                {profileImage && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Picture
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Personal Information Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Account Info (Read-only) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 font-mono bg-white dark:bg-gray-700 px-3 py-2 rounded border">
                    {user.email}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</Label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                    }`}>
                      {user.role === 'admin' ? 'Administrator' : 'User'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="block text-sm font-medium mb-2">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="block text-sm font-medium mb-2">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              {/* Account Stats */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Account Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Member since:</span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(user.createdAt!).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Two-Factor Auth:</span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {user.twoFactorEnabled ? '✓ Enabled' : '✗ Disabled'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}