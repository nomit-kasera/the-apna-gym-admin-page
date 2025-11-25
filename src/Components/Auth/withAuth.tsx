import { useRouter } from "next/router";
import { useEffect } from "react";
import useUserStore from "@/stores/useUserStore";
import type { ProfileObject } from "@/utils/AuthUtils";
import { getProfileFromStorage, signOut } from "@/utils/AuthUtils";
import { dashboardApiClient } from "@/Module/DashboardServices/dashboardApiClient";

export default function withAuth(Component: any) {
  return function IsAuth(props: any) {
    const router = useRouter();
    const {
      isAuthenticated,
      setUserProfile,
      setAuthenticated,
      setToken,
      reset,
    } = useUserStore();

    const validateAndCheck = async (profile: ProfileObject) => {
      try {
        const response = await dashboardApiClient.validateToken(profile.token);

        setUserProfile(
          profile.name,
          profile.email,
          profile.user_id,
        );
        setAuthenticated(true);
        setToken(profile.token);
      } catch (err: any) {
        const visitedPath = router.asPath;
        signOut();
        reset();
        router.push(`/login?ref=${encodeURIComponent(visitedPath)}`);
        return;
      }
    };

    useEffect((): void => {
      const profile: ProfileObject | null = getProfileFromStorage();
      if (isAuthenticated) {
        return;
      }

      const visitedPath = router.asPath;

      if (!profile) {
        router.push(`/login?ref=${encodeURIComponent(visitedPath)}`);
        return;
      }

      // verify token via api call
      validateAndCheck(profile);
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}