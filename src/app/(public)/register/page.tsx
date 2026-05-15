import { RegisterForm } from "@/features/auth/register/components/register-form";

/**
 * Registration page
 * Keep page.tsx thin - only handles routing and layout
 */
export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="text-center text-sm text-gray-600 mt-2">
            Join our platform today
          </p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
