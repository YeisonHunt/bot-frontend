import { FC, useEffect } from "react";
import { Logo } from "@/widgets";
import Menu from "../Menu/Menu";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { toggle } from "@/app/storeHelpers/themeSlice";

const LayoutHeader: FC = () => {

  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.value);

  // useEffect(() => {
  //   document.documentElement.classList.toggle('dark', theme === 'dark');
  // }, [theme]);


  useEffect(() => {
    // Check if user has set their system to use dark mode
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // If user prefers dark mode and theme is not already set to dark, dispatch toggle
    if (userPrefersDark && theme !== 'dark') {
      dispatch(toggle());
    }

    // If user prefers light mode and theme is not already set to light, dispatch toggle
    if (!userPrefersDark && theme !== 'light') {
      dispatch(toggle());
    }

    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme, dispatch]);

  return (
    <>
      <header>
        <nav className="navbar bg-base-100">
          <Menu
            links={[
              { name: "Homepage", href: "/" },
              { name: "Create bot", href: "/create-bot" },
              { name: "404", href: "/awesome-page-that-doesnt-exists" },
            ]}
          />
          <Logo logoName={"Bot Creator - by MrHunt"} />
          <div className="navbar-end mr-4">
            {/* <button onClick={() => dispatch(toggle())}>
              Switch to {theme === 'light' ? 'dark' : 'light'} mode
            </button> */}
            <button onClick={() => dispatch(toggle())} title="Sync with the machine theme">
              PC theme: {theme}
            </button>
          </div>
        </nav>
      </header>
    </>
  );
};

export default LayoutHeader;
