import Image from "next/image";
import { MdOutlineAccountCircle } from "react-icons/md";
import BreadcrumbWithAdminPanel from "../breadcrumb-with-admin-panel";

const SettingsClientComponent = () => {
  return (
    <div className="settingpage">
      <BreadcrumbWithAdminPanel
        h2Title=" All Published "
        spanTitleOne={`Settings`}
        spanTitleTwo="Settings"
      />
      <div className="profilesettings">
        <div className="leftprofile_details flex">
          <Image
            src={"/img/coder.png"}
            width={600}
            height={400}
            alt="User image"
          />

          <div className="w-full">
            <div className="flex-sb flex-left mt-2 flex">
              <h2>My Profile:</h2>
              <h3>
                Arfatur Rahman <br /> Web developer{" "}
              </h3>
            </div>
            <div className="flex-sb flex-left mt-2 flex">
              <h2>Phone:</h2>
              <label htmlFor="phone">
                <input type="text" id="phone" defaultValue={"018194399292"} />
              </label>
            </div>
            <div className="flex-sb flex-left mt-2 flex">
              <h2>Email:</h2>
              <label htmlFor="email">
                <input
                  type="text"
                  id="email"
                  defaultValue={"arfatrahman08@gmail.com"}
                />
              </label>
            </div>
            <div className="flex-center w-100 mt-2 flex">
              <button>Save</button>
            </div>
          </div>
        </div>
        <div className="rightlogoutsec">
          <div className="topaccountbox">
            <h2 className="flex-sb flex">
              My Account <MdOutlineAccountCircle />
            </h2>
            <hr />
            <div className="flex-sb mt-1 flex">
              <h3>
                Active Account <br />
                <span>Email</span>
              </h3>
              <button>Log Out</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsClientComponent;
