import PrivateRoute from "@/components/ui/PrivateRoute";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateRoute>{children}</PrivateRoute>;
}