import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { profileApi } from "../api/profile";
import { emptyProfile, type Profile } from "../types/profile";

export type ProfileStatus = "loading" | "idle" | "saving" | "saved" | "error";

interface ProfileCtx {
  profile: Profile;
  status: ProfileStatus;
  error: string | null;
  /** Merge partiel des champs racine. */
  patch: (delta: Partial<Profile>) => void;
  /** Helper : retourne un setter pour une sous-liste typée. */
  setField: <K extends keyof Profile>(key: K) => (value: Profile[K]) => void;
  /** Sauvegarde l'ensemble du profil. */
  save: () => Promise<void>;
}

const ProfileContext = createContext<ProfileCtx | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [status, setStatus] = useState<ProfileStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    profileApi
      .get()
      .then((p) => {
        setProfile({ ...emptyProfile(), ...p });
        setStatus("idle");
      })
      .catch((e) => {
        setError(String(e));
        setStatus("error");
      });
  }, []);

  const patch = useCallback(
    (delta: Partial<Profile>) => setProfile((p) => ({ ...p, ...delta })),
    [],
  );

  const setField = useCallback(
    <K extends keyof Profile>(key: K) =>
      (value: Profile[K]) =>
        setProfile((p) => ({ ...p, [key]: value })),
    [],
  );

  const save = useCallback(async () => {
    setStatus("saving");
    setError(null);
    try {
      const saved = await profileApi.put(profile);
      setProfile({ ...emptyProfile(), ...saved });
      setStatus("saved");
      setTimeout(() => setStatus((s) => (s === "saved" ? "idle" : s)), 2000);
    } catch (e) {
      setError(String(e));
      setStatus("error");
    }
  }, [profile]);

  const value = useMemo<ProfileCtx>(
    () => ({ profile, status, error, patch, setField, save }),
    [profile, status, error, patch, setField, save],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileCtx {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile() doit être utilisé dans <ProfileProvider>");
  return ctx;
}
