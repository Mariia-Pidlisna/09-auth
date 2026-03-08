"use client";

import css from "./SignUpPage.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api/clientApi";
import { AxiosError } from "axios";
import { useAuthUserStore } from "@/lib/store/authStore";

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState("");
  const setUser = useAuthUserStore((state) => state.setUser);

  const handleSubmit = async (formData: FormData) => {
    setError("");
    try {
      const formValues = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };
      const res = await registerUser(formValues);

      if (res) {
        setUser(res);
        router.push("/profile");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 400 && message === "User exists") {
          setError("User wiht such email already exists");
        } else {
          setError(message || "Server error");
        }
      } else {
        setError("Oops... some error");
        console.error("unexpected error:", error);
      }
    }
  };
  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form action={handleSubmit} className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}