import { FC, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBots, selectBots } from "../../../../app/storeHelpers/botSlice";
import { Bot } from "types/generalTypes";
import { DynamicCounter } from "../../Components/DynamicCounter";
import { BACKEND_API_URL } from "@/shared/constants";

const Home: FC = () => {
  const bots = useSelector(selectBots);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBots() as any);
  }, [dispatch]);

  const resetBots = async () => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/bots`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      console.error("Failed to reset bots");
    }
  };

  return (
    <>
      <section>
        <div className="hero min-h-[calc(100vh-64px)] bg-base-100">
          <div className="hero-content flex-col lg:flex-row">
            <div>
              <div className="flex justify-between">
                <Link to="/create-bot" className="btn-primary btn mb-2">
                  Create new bot
                </Link>

                <button className="btn-neutral btn" onClick={resetBots}>
                  Reset bots data
                </button>
              </div>

              <hr />
              <div className="overflow-x-auto">
                <table className="table">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>Bot #</th>
                      <th>Actions on course</th>
                      <th>~ ETA</th>
                      <th>Completed Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bots && bots.map((bot: Bot) => <TableBotRow bot={bot} />)}

                    {!bots.length && (
                      <>
                        <tr>
                          <td>
                            <div className="flex w-52 flex-col gap-4">
                              <div className="skeleton h-12 w-12"></div>
                            </div>
                          </td>
                          <div className="mt-3 flex w-52 flex-col gap-4">
                            <div className="skeleton h-4 w-28"></div>
                            <div className="skeleton h-4 w-full"></div>
                            <div className="skeleton h-4 w-full"></div>
                          </div>
                          <td>
                            <div className="flex w-52 flex-col gap-4">
                              <div className="skeleton h-4 w-28"></div>
                              <div className="skeleton h-4 w-full"></div>
                              <div className="skeleton h-4 w-full"></div>
                            </div>
                          </td>

                          <td>
                            <div className="flex w-52 flex-col gap-4">
                              <div className="skeleton h-4 w-28"></div>
                              <div className="skeleton h-4 w-full"></div>
                              <div className="skeleton h-4 w-full"></div>
                            </div>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
                {!bots.length && (
                  <>
                    <span>No bots running. Please create a new one.</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const TableBotRow = ({ bot }: { bot: Bot }) => {
  return (
    <tr key={bot.id}>
      <td>
        <div className="flex items-center gap-3">
          <div
            className={`avatar ${
              bot.completedActions.filter(
                (activity) => activity.state === "fulfilled",
              ).length !== bot.completedActions.length
                ? "online"
                : "offline"
            } `}
          >
            <div className="mask mask-squircle h-12 w-12">
              <img
                src="https://daisyui.com/tailwind-css-component-profile-5@56w.png"
                alt="Avatar Tailwind CSS Component"
              />
            </div>
          </div>
          <div>
            <div className="font-bold">{bot.title}</div>
            <div className="text-sm opacity-50">{bot.id}</div>
          </div>
        </div>
      </td>
      <td>
        {bot.completedActions
          .filter((activity) => activity.state === "pending")
          .map((activity) => (
            <div className="flex ">
              <span className="loading loading-ring loading-md"></span>
              <div className="align-middle">
                <span className="badge badge-ghost badge-md ml-2 mt-1 text-lg">
                  {activity.title}
                </span>
                <progress className="progress ml-3 w-56"></progress>
                <br></br>
              </div>
            </div>
          ))}
      </td>
      <td>
        <DynamicCounter bot={bot} />
      </td>
      <td>
        {bot.completedActions
          .filter((activity) => activity.state === "fulfilled")
          .map((activity) => (
            <>
              <span className="text-md badge badge-neutral badge-md mt-2 text-white line-through">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="mr-2 inline-block h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {activity.title}
              </span>
              <br></br>
            </>
          ))}
      </td>
    </tr>
  );
};

export default Home;
