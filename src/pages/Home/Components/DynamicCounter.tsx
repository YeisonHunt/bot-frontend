import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Bot } from "types/generalTypes";
import { updateBot } from '../../../app/storeHelpers/botSlice';
import Swal from 'sweetalert2';

export const DynamicCounter = ({ bot }: { bot: Bot }) => {

    const dispatch = useDispatch();
    const [timeLeft, setTimeLeft] = useState(
      bot.completedActions.map(activity =>
        activity.state === 'fulfilled' ? 0 : activity.duration / 1000
      )
    );
  
    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime.map((time, index) => {
          if (time > 0) {
            return Math.floor(time - 1); // Round down to the nearest whole number
          } else {
            // If time reaches 0 and action is still pending, update the action status
            if (bot.completedActions[index].state === 'pending') {
              const updatedBot = {
                ...bot,
                completedActions: bot.completedActions.map((action, actionIndex) =>
                  actionIndex === index ? { ...action, state: 'fulfilled' } : action
                ),
              };
              //@ts-ignore types for update action not being correctly recognized
              dispatch(updateBot(updatedBot));
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "One task has been completed",
                showConfirmButton: false,
                timer: 2500
              });
            }
            return 0;
          }
        }));
      }, 1000);
      return () => clearInterval(timer);
    }, [bot, dispatch]);
  
    return (
      <td>
        {
          timeLeft.map((time, _index) => (
            <>
              <span className="w-24 inline text-left">
                {time > 60 ? `${Math.floor(time / 60)} mins left` : `${time} seconds left`}
              </span>
              <br></br>
            </>
          ))
        }
      </td>
    );
  }