import Aside from "./Aside";
import Header from "./Header";

function ParentComponent({
  appOpen,
  appAsideOpen,
}: {
  appOpen: boolean;
  appAsideOpen: () => void;
}) {
  return (
    <div>
      <Header handleAsideOpen={appAsideOpen} />
      <Aside asideOpen={appOpen} handleAsideOpen={appAsideOpen} />
    </div>
  );
}

export default ParentComponent;
