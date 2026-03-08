"use client";

import css from "./EditProfilePage.module.css";
import Image from "next/image";
import { updateMe, getMe } from "@/lib/api/clientApi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthUserStore } from "@/lib/store/authStore";

type UpdateUserData = {
  username: string;
};

const EditProfile = () => {
  const setUser = useAuthUserStore((state) => state.setUser);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    getMe().then((user) => {
      setUserName(user.username ?? "");
      setUserEmail(user.email);
      setUserAvatar(user.avatar);
    });
  }, []);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateUserData) => updateMe(data),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      toast.success("Profile updated successfully");
      router.push("/profile");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const validate = () => {
    const newErrors: typeof errors = {};
    if (userName.trim().length < 3) {
      newErrors.userName = "Minimum 3 characters";
    }
    if (userName.length > 50) {
      newErrors.userName = "Maximum 50 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    mutate({ username: userName });
  };

  const handleCancel = () => router.push("/profile");

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        {userAvatar && (
          <Image
            src={userAvatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        )}

        <form action={handleSubmit} className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              id="username"
              type="text"
              className={css.input}
            />
            {errors.userName && (
              <span className={css.error}>{errors.userName}</span>
            )}
          </div>

          <p>Email: {userEmail}</p>

          <div className={css.actions}>
            <button
              disabled={isPending}
              type="submit"
              className={css.saveButton}
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              type="button"
              className={css.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditProfile;