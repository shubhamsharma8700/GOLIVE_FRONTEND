import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { useGetProfileQuery } from "../store/services/auth.service";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { setProfile, logout } from "../store/slices/authSlice";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);

  // ❗ Always call hooks unconditionally
  const { data, isLoading, isError } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  // Save profile when fetched
  useEffect(() => {
    if (data) {
      dispatch(setProfile(data));
    }
  }, [data, dispatch]);

  // ❗ Now handle all the return conditions AFTER the hooks

  // No token → not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Loading Profile
  if (isLoading) {
    return <div className="p-5 text-center">Loading...</div>;
  }

  // Token invalid → logout and redirect
  if (isError) {
    dispatch(logout());
    return <Navigate to="/login" replace />;
  }

  return children;
}
