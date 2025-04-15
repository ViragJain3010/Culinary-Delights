"use client"; 

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ProtectedProps = {
  children: React.ReactNode;
};

export const Protected = ({ children }: ProtectedProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
    } else {
      setAuthenticated(true);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return authenticated ? <>{children}</> : null;
};
