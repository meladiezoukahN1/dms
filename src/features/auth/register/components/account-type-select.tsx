"use client";

import { useFormContext, Controller } from "react-hook-form";
import type { RegisterFormSchemaType } from "../schemas/register.schema";

/**
 * Account type selector component
 */
export function AccountTypeSelect() {
  const { control } = useFormContext<RegisterFormSchemaType>();

  return (
    <Controller
      control={control}
      name="accountType"
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900">
            Account Type
          </label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                {...field}
                type="radio"
                value="individual"
                id="account-individual"
                className="h-4 w-4"
              />
              <label htmlFor="account-individual" className="text-sm text-gray-700">
                Individual
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                {...field}
                type="radio"
                value="organization"
                id="account-organization"
                className="h-4 w-4"
              />
              <label htmlFor="account-organization" className="text-sm text-gray-700">
                Organization
              </label>
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-500">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}
