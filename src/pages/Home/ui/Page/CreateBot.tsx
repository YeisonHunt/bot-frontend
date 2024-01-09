import { useEffect, useState } from 'react';
import { createBot, fetchRules, selectBots } from '@/app/storeHelpers/botSlice';
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import { Action } from 'types/generalTypes';

const CreateBot = () => {
    const [title, setTitle] = useState('');
   
    const dispatch = useDispatch();
    const navigate = useNavigate();



    let rules = useSelector((state: RootState) => state.bots.rules);

    let bots = useSelector(selectBots);
    let fulfilledRuleIds = bots.flatMap(bot => bot.completedActions.map(rule => rule.id));
    let pendingRules = rules.filter(rule => !fulfilledRuleIds.includes(rule.id));

    let [selectedOption, setSelectedOption] = useState<string | number | readonly string[] | undefined>('');


    useEffect(() => {
        dispatch(fetchRules() as any);
    }, [dispatch]);

    useEffect(() => {
        setSelectedOption(pendingRules[0]?.id);
      }, [pendingRules]);



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("selected",selectedOption);
        // Find the selected action
        const selectedAction = pendingRules.find(rule => rule.id === Number(selectedOption));

        // Filter out the selected action from the pending actions
        const remainingActions = pendingRules.filter(rule => rule.id !== Number(selectedOption));

        // Pick a random action from the remaining actions
        const randomAction = remainingActions[Math.floor(Math.random() * remainingActions.length)];

        console.log(randomAction);

        try {
            dispatch(createBot({
                id: Date.now(), title, completedActions: [
                    selectedAction as any,
                    randomAction
                ]
            }) as any);
            setTitle('');
            navigate('/');
        } catch (error) {
            console.error(error);
        }

    };

    return (
        <section >

            <div className='hero min-h-[calc(100vh-64px)] bg-base-100'>
                <div className='hero-content flex flex-row lg:flex-row'>
                    <div>
                        <Link to="/" className="btn-neutral btn mb-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                        </svg>
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2" htmlFor="title">
                                Bot Title
                            </label>
                            <input required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-100 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="">First rule</label>
                            <select required className="select select-bordered w-full max-w-xs" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                                {pendingRules && pendingRules.map(rule => (
                                    <option key={rule.id} value={rule.id}>
                                        {rule.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Create Bot
                        </button>
                    </form>

                </div>

            </div>
        </section>


    );
};

export default CreateBot;