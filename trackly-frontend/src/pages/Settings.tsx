import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  MobileTabs,
  MobileTabsList,
  MobileTabsTrigger,
  MobileTabsContent,
} from "@/components/ui/mobile-tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Lock,
  Globe,
  Palette,
  LogOut,
  Camera,
  Save,
  Shield,
  Settings as SettingsIcon,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/components/ThemeProvider";

function setThemeCss(themeName: string) {
  // Remove any existing theme link
  const existing = document.getElementById("theme-css");
  if (existing) existing.remove();
  // Create new link with cache-busting param
  const link = document.createElement("link");
  link.id = "theme-css";
  link.rel = "stylesheet";
  link.href = `/themes/${themeName}.css?t=${Date.now()}`;
  document.head.appendChild(link);
  return () => {
    link.remove();
  };
}

// Utility to convert theme file name to label
function themeFileToLabel(file: string) {
  return file
    .replace(/\.css$/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Vite-specific: get all theme CSS files in public/themes
const themeFiles = Object.keys(
  import.meta.glob("/public/themes/*.css", { eager: false })
);

const themeNames = themeFiles
  .map((path) => {
    // path will be like '/public/themes/amethyst-haze.css'
    const match = path.match(/\/?themes\/([\w-]+)\.css$/);
    return match ? match[1] : null;
  })
  .filter(Boolean);

export function Settings() {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    department: "",
    manager: "",
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  });

  const [preferences, setPreferences] = useState({
    apiBaseUrl: "https://api.trackly.com",
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
  });

  const updateProfile = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const updateSecurity = (field: string, value: string | boolean) => {
    setSecurity((prev) => ({ ...prev, [field]: value }));
  };

  const updatePreferences = (field: string, value: string | boolean) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const changePassword = () => {
    if (security.newPassword !== security.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Password changed",
      description: "Your password has been updated successfully.",
    });

    setSecurity((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  const savePreferences = () => {
    toast({
      title: "Preferences saved",
      description: "Your application preferences have been updated.",
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "finance":
        return "default";
      case "approver":
        return "secondary";
      case "employee":
        return "outline";
      default:
        return "outline";
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Theme state
  const [availableThemes, setAvailableThemes] = useState<
    { value: string; label: string }[]
  >(
    themeNames.map((file) => ({
      value: file,
      label: themeFileToLabel(file),
    }))
  );
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [pendingTheme, setPendingTheme] = useState<string | null>(null);
  const [originalTheme, setOriginalTheme] = useState(theme);

  // Apply theme immediately on selection, but only persist on Save
  useEffect(() => {
    if (pendingTheme !== null) {
      setTheme(pendingTheme);
      setThemeCss(pendingTheme);
    } else {
      setTheme(selectedTheme);
      setThemeCss(selectedTheme);
    }
  }, [pendingTheme, selectedTheme, setTheme]);

  // When theme changes from outside (login, etc.), update state
  useEffect(() => {
    setSelectedTheme(theme);
    setOriginalTheme(theme);
    setPendingTheme(null);
  }, [theme]);

  return (
    <div className="space-y-4 md:space-y-8 max-w-full">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Manage your account settings and application preferences.
        </p>
        <div className="mt-4">
          <a href="/help">
            <Button variant="outline" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              Help & Support
            </Button>
          </a>
        </div>
      </div>

      <MobileTabs defaultValue="profile" className="space-y-4">
        <div className="overflow-x-auto">
          <MobileTabsList className="grid w-full min-w-max grid-cols-5 h-12">
            <MobileTabsTrigger
              value="profile"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </MobileTabsTrigger>
            <MobileTabsTrigger
              value="security"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
            >
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </MobileTabsTrigger>
            <MobileTabsTrigger
              value="preferences"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
            >
              <SettingsIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Preferences</span>
            </MobileTabsTrigger>
            {/* Theme tab */}
            <MobileTabsTrigger
              value="theme"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
            >
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Theme</span>
            </MobileTabsTrigger>
            <MobileTabsTrigger
              value="account"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </MobileTabsTrigger>
          </MobileTabsList>
        </div>

        <MobileTabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-lg">
                      {getUserInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{profile.name}</h3>
                  <p className="text-muted-foreground">{profile.email}</p>
                  <Badge
                    variant={getRoleBadgeVariant(user?.role || "employee")}
                  >
                    {user?.role}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => updateProfile("name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => updateProfile("email", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => updateProfile("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={profile.department}
                    onChange={(e) =>
                      updateProfile("department", e.target.value)
                    }
                    placeholder="Engineering"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="manager">Reporting Manager</Label>
                  <Input
                    id="manager"
                    value={profile.manager}
                    onChange={(e) => updateProfile("manager", e.target.value)}
                    placeholder="Jane Smith"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={saveProfile}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </MobileTabsContent>

        <MobileTabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={security.currentPassword}
                  onChange={(e) =>
                    updateSecurity("currentPassword", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={security.newPassword}
                  onChange={(e) =>
                    updateSecurity("newPassword", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={security.confirmPassword}
                  onChange={(e) =>
                    updateSecurity("confirmPassword", e.target.value)
                  }
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={changePassword}>Update Password</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Enable 2FA</h4>
                  <p className="text-sm text-muted-foreground">
                    Secure your account with two-factor authentication
                  </p>
                </div>
                <Switch
                  checked={security.twoFactorEnabled}
                  onCheckedChange={(checked) =>
                    updateSecurity("twoFactorEnabled", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </MobileTabsContent>

        <MobileTabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>
                Configure your application preferences and behavior.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="api-url">API Base URL</Label>
                <Input
                  id="api-url"
                  value={preferences.apiBaseUrl}
                  onChange={(e) =>
                    updatePreferences("apiBaseUrl", e.target.value)
                  }
                />
                <p className="text-xs text-muted-foreground">
                  The base URL for API requests. Contact your administrator if
                  you need to change this.
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Notification Preferences</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h5 className="font-medium">Email Notifications</h5>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) =>
                        updatePreferences("emailNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h5 className="font-medium">Push Notifications</h5>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications in your browser
                      </p>
                    </div>
                    <Switch
                      checked={preferences.pushNotifications}
                      onCheckedChange={(checked) =>
                        updatePreferences("pushNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h5 className="font-medium">Weekly Reports</h5>
                      <p className="text-sm text-muted-foreground">
                        Receive weekly expense summary reports
                      </p>
                    </div>
                    <Switch
                      checked={preferences.weeklyReports}
                      onCheckedChange={(checked) =>
                        updatePreferences("weeklyReports", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={savePreferences}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </MobileTabsContent>

        <MobileTabsContent value="theme" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Select your preferred application theme. This will update the
                look and feel instantly after saving.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2 max-w-xs">
                <label htmlFor="theme-select" className="font-medium">
                  Theme
                </label>
                <Select
                  value={pendingTheme !== null ? pendingTheme : selectedTheme}
                  onValueChange={setPendingTheme}
                >
                  <SelectTrigger id="theme-select" className="w-64">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableThemes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => {
                  if (pendingTheme !== null) {
                    setSelectedTheme(pendingTheme);
                    setTheme(pendingTheme);
                    localStorage.setItem("theme", pendingTheme);
                    setPendingTheme(null);
                    toast({
                      title: "Theme updated",
                      description: `Theme set to ${
                        availableThemes.find((t) => t.value === pendingTheme)
                          ?.label || pendingTheme
                      }.`,
                    });
                  }
                }}
                disabled={
                  pendingTheme === null || pendingTheme === originalTheme
                }
              >
                Save
              </Button>
              {pendingTheme !== null && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setPendingTheme(null);
                    setTheme(originalTheme);
                    setThemeCss(originalTheme);
                  }}
                  className="ml-2"
                >
                  Cancel
                </Button>
              )}
            </CardContent>
          </Card>
        </MobileTabsContent>

        <MobileTabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                View your account details and manage your session.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    User ID
                  </Label>
                  <p className="font-medium">{user?.id}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Account Type
                  </Label>
                  <Badge
                    variant={getRoleBadgeVariant(user?.role || "employee")}
                  >
                    {user?.role}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Member Since
                  </Label>
                  <p className="font-medium">January 2024</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Last Login
                  </Label>
                  <p className="font-medium">Today at 2:30 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Actions that will affect your account session.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                  <div>
                    <h4 className="font-medium">Sign Out</h4>
                    <p className="text-sm text-muted-foreground">
                      Sign out of your current session
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={logout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </MobileTabsContent>
      </MobileTabs>
    </div>
  );
}
