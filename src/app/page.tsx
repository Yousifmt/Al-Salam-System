import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark-blue p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          {/* Logo */}
          <div className="mb-4">
            <Image
              src="/images/logo.png"             // file at: public/images/logo.png
              alt="Al-Salam Training Center Logo"
              width={72}
              height={72}
              priority
              className="h-24 w-24 object-contain drop-shadow-md"
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold font-headline text-center">
            <span className="text-accent">Al-Salam</span>{" "}
            <span className="text-white">Training Center</span>
          </h1>
          <p className="text-muted-foreground text-center">
            Welcome back! Please login to your account.
          </p>
        </div>

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
