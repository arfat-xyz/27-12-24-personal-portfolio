import { useSession } from "next-auth/react";
import { ReactNode } from "react";

const LoginLayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();

  if(status === 'loading'){
    return <div className="h-full"></div>
  }
  return <div>LoginLayout</div>;
};

export default LoginLayout;
