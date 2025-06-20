import { useState, useEffect } from 'react';
import { assets } from "../../assets/assets";

const Header = () => {
    const heroData = [
        { text1: "Drive in for", text2: "Expert Vehicle Care" },
        { text1: "Book Your", text2: "Next Service Today" },
        { text1: "Fast, Reliable", text2: "Auto Maintenance" },
    ];

    const [heroCount, setHeroCount] = useState(0);
    const [playStatus, setPlayStatus] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setHeroCount((count) => (count === 2 ? 0 : count + 1));
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full min-h-screen h-screen flex flex-col justify-center overflow-visible">
            {/* Background Component */}
            {playStatus ? (
                <video className='absolute w-full h-full object-cover z-0 animate-fadeIn' autoPlay loop muted>
                    <source src={assets.video1} type='video/mp4' />
                </video>
            ) : heroCount === 0 ? (
                <img src={assets.image1} className='absolute w-full h-full object-cover z-0 animate-fadeIn' alt="Service Center" />
            ) : heroCount === 1 ? (
                <img src={assets.image2} className='absolute w-full h-full object-cover z-0 animate-fadeIn' alt="Mechanic" />
            ) : (
                <img src={assets.image3} className='absolute w-full h-full object-cover z-0 animate-fadeIn' alt="Car Wash" />
            )}

            {/* Hero Component */}
            <div className='relative z-10 mx-[8vw] max-w-[84vw] flex flex-col justify-center min-h-[80vh]'>
                <div className="hero-text">
                    <p style={{ color: '#fff', textShadow: '0 2px 8px rgba(34,43,49,0.18)' }} className="text-[clamp(60px,8vw,110px)] font-semibold leading-[1.2]">{heroData[heroCount].text1}</p>
                    <p style={{ color: '#fff', textShadow: '0 2px 8px rgba(34,43,49,0.18)' }} className="text-[clamp(60px,8vw,110px)] font-semibold leading-[1.2]">{heroData[heroCount].text2}</p>
                </div>

                <div className="flex items-center gap-12 w-fit mt-[5vh] py-1 px-2 pl-8 rounded-full bg-black/70 cursor-pointer">
                    <p style={{ color: '#fff' }} className="text-lg font-semibold">Explore the Features</p>
                    <img src={assets.arrow_btn} alt="Explore" />
                </div>

                <div className="mt-[8vh] flex justify-between items-center">
                    <ul className="flex items-center gap-6 list-none">
                        <li onClick={() => setHeroCount(0)} className={heroCount === 0 ? "w-4 h-4 bg-orange-600 rounded-full cursor-pointer" : "w-4 h-4 bg-white rounded-full cursor-pointer"}></li>
                        <li onClick={() => setHeroCount(1)} className={heroCount === 1 ? "w-4 h-4 bg-orange-600 rounded-full cursor-pointer" : "w-4 h-4 bg-white rounded-full cursor-pointer"}></li>
                        <li onClick={() => setHeroCount(2)} className={heroCount === 2 ? "w-4 h-4 bg-orange-600 rounded-full cursor-pointer" : "w-4 h-4 bg-white rounded-full cursor-pointer"}></li>
                    </ul>
                    <div className="flex items-center gap-8">
                        <img onClick={() => setPlayStatus(!playStatus)} src={playStatus ? assets.pause_icon : assets.play_icon} alt="Play/Pause" className="cursor-pointer" />
                        <p style={{ color: '#fff' }} className="text-lg">See the video</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header; 