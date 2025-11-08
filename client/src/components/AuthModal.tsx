import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, Loader2, CheckCircle2, Eye, EyeOff, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

type AuthView = "welcome" | "signin" | "signup" | "forgot-password" | "success";

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { signInWithEmail, signUpWithEmail, sendPasswordResetEmail } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<AuthView>("welcome");
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("passenger");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (password.length > 0) {
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (password.length >= 12) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [password]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string, isSignUp: boolean) => {
    if (!password) {
      setPasswordError("");
      return false;
    }
    if (isSignUp && password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };


  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email) || !validatePassword(password, false)) return;

    try {
      setLoading(true);
      await signInWithEmail(email, password);
      setView("success");
      setTimeout(() => {
        onClose();
        toast({ title: "Welcome back!", description: "Successfully signed in" });
      }, 1500);
    } catch (error: any) {
      const errorMessage = error.code === "auth/invalid-credential" 
        ? "Invalid email or password"
        : error.code === "auth/user-not-found"
        ? "No account found with this email"
        : error.code === "auth/wrong-password"
        ? "Incorrect password"
        : "Sign in failed. Please try again";
      
      toast({ title: "Sign in failed", description: errorMessage, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email) || !validatePassword(password, true)) return;
    if (!name.trim()) {
      toast({ title: "Name required", description: "Please enter your full name", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      await signUpWithEmail(email, password, name, role);
      setView("success");
      setTimeout(() => {
        onClose();
        toast({ 
          title: "Account created!", 
          description: `Welcome to BusBuddy, ${name.split(' ')[0]}!` 
        });
      }, 1500);
    } catch (error: any) {
      const errorMessage = error.code === "auth/email-already-in-use"
        ? "An account with this email already exists"
        : error.code === "auth/weak-password"
        ? "Password is too weak. Please use a stronger password"
        : "Account creation failed. Please try again";
      
      toast({ title: "Sign up failed", description: errorMessage, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    try {
      setLoading(true);
      await sendPasswordResetEmail(email);
      toast({ 
        title: "Reset email sent", 
        description: "Check your inbox for password reset instructions" 
      });
      setView("signin");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      toast({ 
        title: "Failed to send reset email", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setRole("passenger");
    setEmailError("");
    setPasswordError("");
    setShowPassword(false);
    setView("welcome");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength >= 75) return "bg-green-500";
    if (passwordStrength >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength >= 75) return "Strong password";
    if (passwordStrength >= 50) return "Medium strength";
    if (passwordStrength > 0) return "Weak password";
    return "";
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border-white/20 shadow-2xl p-0 gap-0">
        {view === "success" ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400 animate-in zoom-in duration-300" />
            </div>
            <h2 className="text-2xl font-bold text-center">You're all set!</h2>
            <p className="text-muted-foreground text-center">Taking you to your dashboard...</p>
          </div>
        ) : view === "welcome" ? (
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="rounded-2xl bg-green-100 dark:bg-green-900/30 p-3">
                  <Zap className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h1 className="text-3xl font-bold">Welcome to BusBuddy</h1>
              <p className="text-muted-foreground">
                Track buses in real-time, save CO₂, and contribute to a sustainable planet
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => setView("signin")}
                className="w-full h-12"
                data-testid="button-show-signin"
              >
                <Mail className="mr-2 h-5 w-5" />
                Sign in with Email
              </Button>

              <div className="pt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setView("signup")}
                    className="text-primary font-semibold hover:underline"
                    data-testid="button-show-signup"
                  >
                    Sign up free
                  </button>
                </p>
              </div>
            </div>
          </div>
        ) : view === "signin" ? (
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <button
                onClick={() => setView("welcome")}
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </button>
              <h1 className="text-2xl font-bold">Sign in to BusBuddy</h1>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to access your dashboard
              </p>
            </div>

            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email address</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  onBlur={() => validateEmail(email)}
                  placeholder="you@example.com"
                  className={cn("h-11", emailError && "border-red-500 focus-visible:ring-red-500")}
                  required
                  data-testid="input-signin-email"
                />
                {emailError && <p className="text-xs text-red-500">{emailError}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="signin-password">Password</Label>
                  <button
                    type="button"
                    onClick={() => setView("forgot-password")}
                    className="text-xs text-primary hover:underline"
                    data-testid="button-forgot-password"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-11 pr-10"
                    required
                    data-testid="input-signin-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={loading || !email || !password}
                data-testid="button-signin-submit"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                onClick={() => setView("signup")}
                className="text-primary font-semibold hover:underline"
                data-testid="button-switch-to-signup"
              >
                Sign up
              </button>
            </div>
          </div>
        ) : view === "signup" ? (
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <button
                onClick={() => setView("welcome")}
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </button>
              <h1 className="text-2xl font-bold">Create your account</h1>
              <p className="text-sm text-muted-foreground">
                Join BusBuddy and start your eco-friendly journey
              </p>
            </div>

            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="h-11"
                  required
                  data-testid="input-signup-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email address</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  onBlur={() => validateEmail(email)}
                  placeholder="you@example.com"
                  className={cn("h-11", emailError && "border-red-500 focus-visible:ring-red-500")}
                  required
                  data-testid="input-signup-email"
                />
                {emailError && <p className="text-xs text-red-500">{emailError}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validatePassword(e.target.value, true);
                    }}
                    onBlur={() => validatePassword(password, true)}
                    placeholder="Create a strong password"
                    className={cn("h-11 pr-10", passwordError && "border-red-500 focus-visible:ring-red-500")}
                    required
                    data-testid="input-signup-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
                {password && !passwordError && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full transition-all duration-300", getPasswordStrengthColor())}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-role">I am a...</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="h-11" data-testid="select-signup-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passenger">Passenger - Track buses and plan trips</SelectItem>
                    <SelectItem value="driver">Driver - Share location and updates</SelectItem>
                    <SelectItem value="admin">Admin - Manage fleet and analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={loading || !email || !password || !name || passwordStrength < 50}
                data-testid="button-signup-submit"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => setView("signin")}
                className="text-primary font-semibold hover:underline"
                data-testid="button-switch-to-signin"
              >
                Sign in
              </button>
            </div>
          </div>
        ) : view === "forgot-password" ? (
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <button
                onClick={() => setView("signin")}
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to sign in
              </button>
              <h1 className="text-2xl font-bold">Reset your password</h1>
              <p className="text-sm text-muted-foreground">
                Enter your email and we'll send you instructions to reset your password
              </p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email address</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  onBlur={() => validateEmail(email)}
                  placeholder="you@example.com"
                  className={cn("h-11", emailError && "border-red-500 focus-visible:ring-red-500")}
                  required
                  data-testid="input-reset-email"
                />
                {emailError && <p className="text-xs text-red-500">{emailError}</p>}
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={loading || !email || !!emailError}
                data-testid="button-reset-submit"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send reset instructions"
                )}
              </Button>
            </form>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
