// src/context/AuthProvider.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { Storage } from "@ionic/storage";
import NDK, { NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { baseConfig } from "../utils";

export interface AuthContextProperties {
  npub: string | null;
  ndk: NDK;
  loading: boolean;
  authenticateWithPrivateKey: (pk: string) => void;
  logout: () => Promise<any>;
}

const AuthContext = createContext({} as AuthContextProperties);

/**
 * Provides authentication context to the application.
 *
 * @param {ReactNode} children - The child components that will have access to the authentication context.
 * @return {JSX.Element} The AuthContext provider element.
 */
const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const [npub, setNpub] = useState<string | null>(null);
  const ndk = new NDK({ explicitRelayUrls: baseConfig.relaysList });
  const storage = new Storage();
  storage.create();

  useEffect(() => {
    /**
     * Loads the private key from storage and authenticates the user if it exists.
     *
     * @return {Promise<void>} A promise that resolves when the private key has been loaded and authentication is complete.
     */
    const loadPrivateKey = async (): Promise<void> => {
      const storedPk = await storage.get("privatekey");
      if (storedPk) {
        authenticateWithPrivateKey(storedPk);
      }
      setLoading(false);
    };

    setLoading(true);
    loadPrivateKey();
  }, []);

  /**
   * Authenticates the user with a private key and store it in the storage.
   *
   * @param {string} pk - The private key to authenticate with.
   * @return {void} This function does not return anything.
   */
  const authenticateWithPrivateKey = (pk: string): void => {
    const signer = new NDKPrivateKeySigner(pk);
    ndk.signer = signer;
    signer.user().then((u) => {
      setNpub(u.npub);
    });
    storage.set("privatekey", signer.privateKey);
  };

  /**
   * Logs out the user by removing their private key from storage.
   *
   * @return {Promise<void>} A promise that resolves when the logout operation is complete.
   */
  const logout = async (): Promise<void> => {
    await storage.remove("privatekey");
  };

  const value = { npub, ndk, loading, authenticateWithPrivateKey, logout };
  return React.createElement(AuthContext.Provider, { value }, children);
};

export { AuthContext, AuthProvider };
