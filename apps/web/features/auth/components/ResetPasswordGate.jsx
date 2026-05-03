"use client";

import { useEffect, useState } from "react";
import { authApi } from "../services/authApi";
import ResetPasswordForm from "./ResetPasswordForm";
import InvalidResetLink from "./InvalidResetLink";

export default function ResetPasswordGate({ token }) {
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    let active = true;

    async function run() {
      if (!token) {
        if (active) {
          setValid(false);
          setLoading(false);
        }
        return;
      }

      try {
        const data = await authApi.validateResetToken(token);
        if (active) {
          setValid(Boolean(data.valid));
        }
      } catch (error) {
        if (active) {
          setValid(false);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      active = false;
    };
  }, [token]);

  if (loading) return <p className="text-slate-600 dark:text-slate-300">Validating reset link...</p>;
  if (!valid) return <InvalidResetLink />;
  return <ResetPasswordForm token={token} />;
}
